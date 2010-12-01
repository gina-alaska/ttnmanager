class UserObserver < ActiveRecord::Observer
  def before_update(model)
    if model.mobile_pin_accepted_changed? and model.mobile_pin_accepted
      UserMailer.delay.pin_accepted(model)
    end

    true
  end

  def after_update(model)
    if model.mobile_pin_request
      UserMailer.delay.request_pin(model) unless model.mobile_pin_accepted?
    end

    true
  end
end
