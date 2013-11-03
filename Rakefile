
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

  jsstring = ""
  export_files = ["node.js", "branch_node.js", "priority.js", "sequence.js", "random.js", "task.js", "decorator.js", "invert_decorator.js", "always_succeed_decorator.js", "always_fail_decorator.js"]

  # remove duplication through same function surroundings
  start = "(function(exports) {"
  strict = '"use strict";'
  ending = "}(BehaviorTree));"

  export_files.each do |filename|
    jsstring += File.read("src/#{filename}").gsub(start, "").gsub(ending, "").gsub(strict, "")
  end

  uncompressed_output = File.read("src/behavior_tree.js").gsub(strict, "") + start + jsstring + ending
  output = Uglifier.new(:copyright => true).compile(uncompressed_output)

  File.open('btree.min.js', 'w') do |file|
    file.write(output)
  end

  # Version including dependencys and the extended stuff
  def extract_copyright(text)
    cpos = text.index('*/')
    return text[0..(cpos+1)], text[(cpos+2)..text.length]
  end


  copyright, code = extract_copyright(uncompressed_output)
  libs = Uglifier.new(:copyright => false).compile(File.read("lib/base.js"))
  compressed_code = Uglifier.new(:copyright => false).compile(code)

  File.open('btree-complete.min.js', 'w') do |file|
    file.write(File.read("src/comment_complete.js") + libs + "\n" + compressed_code)
  end

  File.open('btree-complete.js', 'w') do |file|
    file.write(File.read("src/comment_complete.js") + File.read("lib/base.js") + code)
  end
end
