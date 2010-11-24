set :deploy_to, "/www/#{application}"

role :app, "webdev@edge"
role :web, "webdev@edge"
role :db, "webdev@edge", :primary => true

