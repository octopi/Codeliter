# Codeliter

## About

Perform IDE-like code highlighting on StackOverflow and GitHub

Codeliter is a Chrome extension that provides two great features of modern IDEs, highlighting **all usages of a variable** and **enabling bracket matching**. Try it below! Start highlighting some code or clicking on curly brackets and feel the magic.

For more: [http://davidhu.me/codeliter/](http://davidhu.me/codeliter/)

## Known Issues

* Highlighting removes user selection (making it harder to copy/paste selected test)
* Highlighting part of an identifier will disable the ability to highlight the full identifier again

Currently there is only support for StackOverflow and GitHub pages. The code on these pages follow a very predictable DOM structure that makes it easy to perform  highlighting. Extending to more generic `<code>` or `<pre>` tags may be possible future work, but would require a different mechanism than what currently exists.