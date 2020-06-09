// format intersection data
const formatIntersectionData = (data) => {
    // compiling solo set data - how many values per set
    const soloSets = [];
  
    // nameStr is for the setName, which makes it easy to compile
    // each name would be A, then B, so on..
    const nameStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substr(0, data.length);
    data.forEach((x, i) => {
      soloSets.push({
        name: x.name,
        setName: nameStr.substr(i, 1),
        num: x.values.length,
        values: x.values,
      });
    });
  
    // compiling list of intersection names recursively
    // ["A", "AB", "ABC", ...]
    const getIntNames = (start, end, nameStr) => {
      // eg. BCD
      const name = nameStr.substring(start, end);
  
      // when reaching the last letter
      if (name.length === 1) {
        return [name];
      }
      const retArr = getIntNames(start + 1, end, nameStr);
  
      // eg. for name = BCD, would return [B] + [BC,BCD,BD] + [C,CD,D]
      return [name[0]].concat(retArr.map((x) => name[0] + x), retArr);
    };
  
    let intNames = getIntNames(0, nameStr.length, nameStr);
  
    // removing solo names
    intNames = intNames.filter((x) => x.length !== 1);
  
    let intersections = [];
  
    // compile intersections of values for each intersection name
    intNames.forEach((intName) => {
      // collecting all values: [pub1arr, pub2arr, ...]
      const values = intName.split('').map((set) => soloSets.find((x) => x.setName === set).values);
  
      // getting intersection
      // https://stackoverflow.com/questions/37320296/how-to-calculate-intersection-of-multiple-arrays-in-javascript-and-what-does-e
      const result = values.reduce((a, b) => a.filter((c) => b.includes(c)));
      intersections.push({
        name: intName.split('').map((set) => soloSets.find((x) => x.setName === set).name).join(' + '),
        setName: intName,
        num: result.length,
        values: result,
      });
    });
  
    // taking out all 0s
    intersections = intersections.filter((x) => x.value !== 0);
    return { intersections, soloSets };
};

// include solo sets with all its data
const insertSoloDataAll = (intersections, soloSets) => {
    soloSets.forEach(x => {
        intersections.push(x);
    });
    return intersections;
};

// include solo sets with only the values that ARE NOT in other sets
const insertSoloDataOutersect = (intersections, soloSets) => {
    soloSets.forEach(x => {
        // compile all unique values from other sets except current set
        const otherSets = [...new Set(soloSets.map(y => y.setName === x.setName ? [] : y.values).flat())];
        
        // subtract otherSets values from current set values
        const values = x.values.filter(y => !otherSets.includes(y));
        intersections.push({
            name: x.name,
            setName: x.setName,
            num: values.length,
            values: values,
        })
        
    })
    return intersections;
}