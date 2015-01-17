namespace :image do 
  desc "Regenerate Overview Images Cache"
  task :cache => :environment do
    ImageCacheJob.perform_later('overview')
  end
end