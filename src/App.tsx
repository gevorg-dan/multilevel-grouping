import React from "react";
import "./App.css";

import data from "./index.json";

interface DataInterface {
  id: string;
  created_date: string;
  name: string;
  service_name: string;
  service_code: string;
  direction: string;
  description: string;
  budget_item: string;
  sum: string;
}

interface GroupedByDataInterface {
  year: string;
  groups: DataInterface[];
}

interface GroupedByDirectionInterface {
  direction: string;
  groups: DataInterface[];
}

const b = [
  { year: "2017", data: [{ name: "fasa" }] },
  { year: "2018", data: [{ name: "dsg" }, { name: "123" }] }
];

function groupingBy(
  data: DataInterface[],
  groupBy: "year" | "direction" | "budget_item" | "service_code"
): {
  year?: string;
  direction?: string;
  budget_item?: string;
  service_code?: string;
  groups: DataInterface[];
}[] {
  const groupedDataBy: any[] = [];

  data.forEach(el => {
    const groupProperty =
      groupBy === "year"
        ? el.created_date.substr(el.created_date.length - 4)
        : el[groupBy];
    const currentGroup = groupedDataBy.findIndex(
      group => group[groupBy] === groupProperty
    );
    if (currentGroup === -1) {
      groupedDataBy.push({ [groupBy]: groupProperty, groups: [el] });
    } else {
      groupedDataBy[currentGroup].groups.push(el);
    }
  });
  return groupedDataBy;
}

function GroupedDataList({ data }: { data: DataInterface[] }) {
  const groupedData = groupingBy(data, "year").map(group => ({
    ...group,
    groups: groupingBy(group.groups, "direction").map(group => ({
      ...group,
      groups: groupingBy(group.groups, "budget_item").map(group => ({
        ...group,
        groups: groupingBy(group.groups, "service_code")
      }))
    }))
  }));

  return (
    <div>
      {groupedData.map(({ year, groups }) => (
        <ul key={year}>
          <li>{year}</li>
          {groups.map(({ direction, groups }) => (
            <ul key={direction}>
              <li>{direction}</li>
              {groups.map(({ budget_item, groups }) => (
                <ul key={budget_item}>
                  <li>{budget_item}</li>
                  {groups.map(({ service_code, groups }) => (
                    <ul key={service_code}>
                      <li>{service_code}</li>
                      <ul>
                        {groups.map((el, index) => (
                          <li key={index}>{el.name}</li>
                        ))}
                      </ul>
                    </ul>
                  ))}
                </ul>
              ))}
            </ul>
          ))}
        </ul>
      ))}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <GroupedDataList data={data} />
    </div>
  );
}

export default App;
