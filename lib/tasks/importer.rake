namespace :gina do
  namespace :tz do
    desc  "Import tundra zone shapes"
    task (:import => :environment) do
      include GeoRuby::Shp4r

      shp = ShpFile.open('db/data/TundraAreas_031210.shp')
      #puts shp.first.data['Name']
      #puts shp.first.geometry.as_ewkt(true)
      #item = shp[3]
      #
      srid = 9102634

      shp.each do |item|
        z = Area.find_by_name(item.data['Name'])
        #z = Area.new if z.nil?
        
        if z.nil?
          puts "Unable to find the area!!"
          exit
        end
      
        puts 'Importing: ' + item.data['Name']
        
=begin
        geom = nil
        item.geometry.each do |geo|
          polys = geo.rings.collect do |ring|
            Polygon.from_linear_rings([ring], srid)
          end
          geom = MultiPolygon.from_polygons(polys, srid)
        end
=end
        geom = item.geometry
        geom.srid = srid
        z.geom = geom
        z.save
      end
    end
  end
end
