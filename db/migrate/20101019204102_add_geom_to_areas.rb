class AddGeomToAreas < ActiveRecord::Migration
  def self.up
    Area.connection.execute <<-EOSQL
INSERT into spatial_ref_sys (srid, auth_name, auth_srid, proj4text, srtext) values ( 9102634, 'esri', 102634, '+proj=tmerc +lat_0=54 +lon_0=-150 +k=0.9999 +x_0=500000.0000000002 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs ', 'PROJCS["NAD_1983_StatePlane_Alaska_4_FIPS_5004_Feet",GEOGCS["GCS_North_American_1983",DATUM["North_American_Datum_1983",SPHEROID["GRS_1980",6378137,298.257222101]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",1640416.666666667],PARAMETER["False_Northing",0],PARAMETER["Central_Meridian",-150],PARAMETER["Scale_Factor",0.9999],PARAMETER["Latitude_Of_Origin",54],UNIT["Foot_US",0.30480060960121924],AUTHORITY["EPSG","102634"]]');
    EOSQL


    add_column :areas, :geom, :multi_polygon, :srid => 9102634
    add_index :areas, :geom, :spatial => true
  end

  def self.down
    remove_index :areas, :geom
    remove_column :areas, :geom
  end
end
