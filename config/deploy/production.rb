set :deploy_to, "/www/#{application}"

role :app, "webdev@brute", "webdev@force"
role :web, "webdev@brute", "webdev@force"
role :db, "webdev@brute", :primary => true

