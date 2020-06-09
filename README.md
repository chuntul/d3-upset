# d3 UpSet Plot

A function that creates an UpSet plot in d3. An UpSet plot is a substitute for a Venn diagrams - you can easily view relationships between multiple sets. 

Takes in:
```javascript
const data = {
  "name": "name of set",
  "values": ["A", "B"] 
}
```

It computes each relationship recursively, and sorts decreasing. Tooltips appear when hovering over the bars.

You can either choose to include solo sets with all its data, with the function insertSoloDataAll, or include solo sets with only the values that ARE NOT in other sets with the function insertSoloDataOutersect. You should probably comment out the function you don't want to use. Alternatively, you can comment out both functions, to not include any of the solo sets.

Demo at http://bl.ocks.org/chuntul/f211d4c0ffa12cbadfb601e230341721, where the data given is:
```javascript
 const data = [
      {
        "name": "set1",
        "values": ["a","b","c","d"]
      },
      {
        "name": "set2",
        "values": ["a","b","c","d", "e", "f"]
      },
      {
        "name": "set3",
        "values": ["a","b","g", "h", "i"]
      },
      {
        "name": "set4",
        "values": ["a","i", "j","c","d"]
      }
];
```
