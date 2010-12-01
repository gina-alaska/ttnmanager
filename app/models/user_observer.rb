class UserObserver < ActiveRecord::Observer
  def before_update(model)
    model.mobile_pin_accepted = false if model.mobile_pin_changed?

    if model.mobile_pin_accepted_changed?
      ::Rails.logger.info 'doom?'
    end
    if model.mobile_pin_accepted_changed? and model.mobile_pin_accepted
      UserMailer.delay.pin_accepted(model)
    end

    true
  end

  def after_update(model)
    UserMailer.delay.request_pin(model) unless model.mobile_pin_accepted?
  end
end