require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = 'react-native-native-timeout'
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']
  s.homepage     = package['repository']['url']
  s.authors      = package['author']
  s.platforms    = { ios: '12.0' }
  s.source       = { git: package['repository']['url'], tag: "v#{s.version}" }
  s.source_files = 'ios/**/*.{h,m,mm,swift}'
  s.requires_arc = true
  s.swift_version = '5.0'

  s.dependency 'React-Core'
end
