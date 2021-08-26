# frozen_string_literal: true

class ReviewableHistory < ActiveRecord::Base
  belongs_to :reviewable
  belongs_to :created_by, class_name: 'User'

  enum status: %i[pending approved rejected ignored deleted]
  enum reviewable_history_type: %i[created transitioned edited claimed unclaimed]

  after_commit :compute_user_stats

  # Backward compatibility
  class << self
    alias types reviewable_history_types
  end

  private

  def compute_user_stats
    return unless (created? && pending?) || (transitioned? && !pending?)
    reviewable.compute_user_stats
  end
end

# == Schema Information
#
# Table name: reviewable_histories
#
#  id                      :bigint           not null, primary key
#  reviewable_id           :integer          not null
#  reviewable_history_type :integer          not null
#  status                  :integer          not null
#  created_by_id           :integer          not null
#  edited                  :json
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#
# Indexes
#
#  index_reviewable_histories_on_created_by_id  (created_by_id)
#  index_reviewable_histories_on_reviewable_id  (reviewable_id)
#
