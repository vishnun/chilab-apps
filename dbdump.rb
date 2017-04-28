#!/usr/bin/env ruby

# Potential security risk if we expose this on a public server (the database type). This is only for test server.
Dir['db/*.sqlite3'].each do |filename|
  cmd = "sqlite3 #{filename} .dump > ~/db_dump/#{filename}.dbdump.sql"
  `#{cmd}`
end