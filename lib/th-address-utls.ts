// @ts-ignore
import JQL from "jqljs";
import db from "@/data/address-db.json";
interface address {
  subDistrict: any;
  district: any;
  province: any;
  zipCode: any;
}
function preprocessor(data: any) {
  var lookup: any,
    words: any,
    expanded: address[] = [],
    t: any;
  if (data.lookup && data.words) {
    // compact with dictionary and lookup
    lookup = data.lookup.split("|");
    words = data.words.split("|");
    data = data.data;
  }
  t = function (text: any) {
    function repl(m: any) {
      var ch = m.charCodeAt(0);
      return words[ch < 97 ? ch - 65 : 26 + ch - 97];
    }

    if (typeof text === "number") {
      text = lookup[text];
    }
    return text.replace(/[A-Z]/gi, repl);
  };
  data.map(function (provinces: any) {
    var i = 1;
    if (provinces.length === 3) {
      // geographic database
      i = 2;
    }

    provinces[i].map(function (amphoes: any) {
      amphoes[i].map(function (districts: any) {
        districts[i] =
          districts[i] instanceof Array ? districts[i] : [districts[i]];
        districts[i].map(function (zipcode: any) {
          var entry = {
            subDistrict: t(districts[0]),
            district: t(amphoes[0]),
            province: t(provinces[0]),
            zipCode: zipcode,
          };
          expanded.push(entry);
        });
      });
    });
  });
  return expanded;
}
const collection = new JQL(preprocessor(db));
export const resolveResultByField = (type: string, searchStr: string) => {
  let possibles = [];
  try {
    possibles = collection
      .select("*")
      .where(type)
      .match(`^${searchStr}`)
      .orderBy(type)
      .limit(10)
      .fetch();
  } catch (e) {
    return [];
  }
  return Object.values(possibles);
};
