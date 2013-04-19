#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Convert a csv into useful html and css

To remove windows line carriages in vim:
:1,$s/^M//g
"""

import csv
from string import Template
import string

BREAK = """%s
=====================
"""

CSS = "#${word} { left: ${x}px; top: ${y}px; width: ${width}px; height: ${height}px; }\n"

HTML = '<div id="${word}" class="spotlight">${word}</div>\n'

JADE = '  #${word}.spotlight ${word}\n'

JS = "'${word}',"


def main():
    css_out = ""
    html_out = ["", "", "", ""] # one per screen
    js_out = ["[", "[", "[", "["] # one per screen
    css = Template(CSS)
    html = Template(HTML)
    jade = Template(JADE)
    js = Template(JS)

    with open('../data/cube-words.csv', 'rb') as csvfile:
        for row in csv.DictReader(csvfile):
            #print row
            screen = int(row['screen'])
            css_out += css.substitute(row)
            html_out[screen] += jade.substitute(row)
            js_out[screen] += js.substitute(row)

    # print CSS to stdout, and write the file directly
    print BREAK % ("css")
    print css_out
    with open('../public/css/words.css', 'wb') as csvoutfile:
        csvoutfile.write(css_out)

    for i in range(4):
        title = "JS %s" % i
        print BREAK % title
        print js_out[i][0:-1] + "];"

    for i in range(4):
        title = "HTML %s" % i
        print BREAK % title
        print html_out[i]

if (__name__ == '__main__'):
    main()
