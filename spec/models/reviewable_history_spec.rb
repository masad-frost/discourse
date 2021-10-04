# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ReviewableHistory, type: :model do
  fab!(:user) { Fabricate(:user) }
  fab!(:admin) { Fabricate(:admin) }
  fab!(:moderator) { Fabricate(:moderator) }

  it { is_expected.to define_enum_for(:status).with_values(%i[pending approved rejected ignored deleted]) }
  it { is_expected.to define_enum_for(:reviewable_history_type).with_values(%i[created transitioned edited claimed unclaimed]) }

  it "adds a `created` history event when a reviewable is created" do
    reviewable = ReviewableUser.needs_review!(target: user, created_by: admin)
    reviewable.perform(moderator, :approve_user)
    reviewable = ReviewableUser.needs_review!(target: user, created_by: admin)

    history = reviewable.history
    expect(history.size).to eq(3)

    expect(history[0]).to be_created
    expect(history[0]).to be_pending
    expect(history[0].created_by).to eq(admin)
  end

  it "adds a `transitioned` event when transitioning" do
    reviewable = ReviewableUser.needs_review!(target: user, created_by: admin)
    reviewable.perform(moderator, :approve_user)
    reviewable = ReviewableUser.needs_review!(target: user, created_by: admin)

    history = reviewable.history
    expect(history.size).to eq(3)
    expect(history[1]).to be_transitioned
    expect(history[1]).to be_approved
    expect(history[1].created_by).to eq(moderator)

    expect(history[2]).to be_transitioned
    expect(history[2]).to be_pending
    expect(history[2].created_by).to eq(admin)
  end

  it "won't log a transition to the same state" do
    p0 = Fabricate(:post)
    reviewable = PostActionCreator.spam(Fabricate(:user), p0).reviewable
    expect(reviewable.reviewable_histories.size).to eq(1)
    PostActionCreator.inappropriate(Fabricate(:user), p0)
    expect(reviewable.reload.reviewable_histories.size).to eq(1)
  end

  it "adds an `edited` event when edited" do
    reviewable = Fabricate(:reviewable)
    old_category = reviewable.category

    reviewable.update_fields({ category_id: nil }, moderator)

    history = reviewable.history
    expect(history.size).to eq(2)

    expect(history[1]).to be_edited
    expect(history[1].created_by).to eq(moderator)
    expect(history[1].edited).to eq("category_id" => [old_category.id, nil])
  end

  describe "Callbacks" do
    let!(:reviewable) { Fabricate(:reviewable_queued_post) }
    let(:user) { reviewable.created_by }
    let(:user_stats) { user.user_stat }

    before do
      user_stats.update!(pending_posts_count: 0) # because callbacks
    end

    context "when creating a new reviewable history record" do
      let(:record) { Fabricate.build(:reviewable_history, reviewable_history_type: type, status: status, reviewable: reviewable) }

      context "when history type is 'created'" do
        let(:type) { :created }

        context "when reviewable is pending" do
          let(:status) { :pending }

          it "computes user stats" do
            expect { record.save! }.to change { user_stats.pending_posts_count }.by 1
          end
        end

        context "when reviewable is not pending" do
          let(:status) { :approved }

          it "does nothing" do
            expect { record.save! }.not_to change { user_stats.pending_posts_count }
          end
        end
      end

      context "when history type is 'transitioned'" do
        let(:type) { :transitioned }

        context "when reviewable is pending" do
          let(:status) { :pending }

          it "does nothing" do
            expect { record.save! }.not_to change { user_stats.pending_posts_count }
          end
        end

        context "when reviewable is not pending" do
          let(:status) { :approved }

          it "computes user stats" do
            expect { record.save! }.to change { user_stats.pending_posts_count }.by 1
          end
        end
      end
    end
  end
end
