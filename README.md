Website for Prime
=================

One of the last TODOs for prime.

Installation
============

```bash
git clone git://github.com/arian/prime-website.git
cd prime-website
npm install
git submodule update --init
```

Static Files
============

Most files are static, like the homepage, docs, CSS etc.
That is why everything is generated / compiled.

```bash
make all
```

That will put everything in the public folder, so you can open it easily.

Goals
=====

- Nice design (contributions welcome).
- Simple.
- Integration with [wrapup-webbuilder](https://github.com/arian/wrapup-webbuilder).
- Documentation for older versions.

How this thing works
====================

I like Jade, Stylus and make, which is why it is used here.
Each `pages/*.jade` file is compiled to `public/*.html`. Same thing for
`styl/*.styl` and `public/css/*.css`.

documentation
-------------

The documentation is in the prime repository in the `doc/prime.md` file.
That file is compiled to HTML, which is then included into `docs.jade` file
so it is integrated into the website.

Because we want documentation for older versions as well, the `docs` folder
contains multiple prime submodules for different prime versions. That means
there isn't just one `docs.jade`, but one for each version, e.g.
`docs-v0.1.0.jade`. The `docs.jade` is used for the latest version of prime.

Other Packages
==============

Prime is not the only package we have, there is also
[elements](https://github.com/mootools/elements), slick, agent and moofx.

Basically we would have to copy this repo for each project. Perhaps we can
modularize some build stuff, so each repo mostly contains the content.
