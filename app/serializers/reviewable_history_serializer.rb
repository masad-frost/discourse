# frozen_string_literal: true

class ReviewableHistorySerializer < ApplicationSerializer
  attributes :id, :created_at

  attribute :status_for_database, key: :status
  attribute :reviewable_history_type_for_database, key: :reviewable_history_type

  has_one :created_by, serializer: BasicUserSerializer, root: 'users'
end
