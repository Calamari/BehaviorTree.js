
begin
  require 'jasmine'
  require 'yaml'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end


desc "minify the source"
task :minify do
  require 'uglifier'


  # remove duplication through same function surroundings
  jsstring = ""
  export_files = ["node.js", "branch_node.js", "selector.js", "sequence.js", "task.js"]
  start = "(function(exports) {"
  strict = '"use strict";'
  ending = "}(BehaviorTree));"

  export_files.each do |filename|
    jsstring += File.read("src/#{filename}").gsub(start, "").gsub(ending, "").gsub(strict, "")
  end

  output = Uglifier.new(:copyright => true).compile(File.read("src/behavior_tree.js").gsub(strict, "") + start + jsstring + ending)

  File.open('btree.min.js', 'w') do |file|
    file.write(output)
  end
end
