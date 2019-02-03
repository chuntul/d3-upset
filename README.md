# d3 UpSet Plot

A function that creates an UpSet plot in d3. An UpSet plot is a substitute for a Venn diagrams - you can easily view relationships between multiple sets. 

Takes in:
- sets: [ ] -> array of set names
- names: [ [ ], [ ], ...] -> an array of arrays (in order by set names) of objects in each set

It computes each relationship automatically, and sorts decreasing.

Demo at https://chuntul.github.io/#4, where the data given is:
```javascript
var sets = ["set1", "set2", "set3", "set4"]
var items = [
                ["a","b","c","d"],
                ["a","b","c","d", "e", "f"],
                ["a","b","g", "h", "i"],
                ["a","i", "j","c","d"]
            ]
```
