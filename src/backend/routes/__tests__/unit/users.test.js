import {
    filterByValue,
    filterEmails
} from '../../users';

const exampleData = [{
        name: "a",
        email: "a"
    },
    {
        name: "b",
        email: "b"
    },
    {
        name: "c",
        email: "c"
    },
    {
        name: "d",
        email: "d"
    },
    {
        name: "e",
        email: "e"
    },
    {
        name: "a",
        email: "f"
    },
    {
        name: "a",
        email: "g"
    },
    {
        name: "a",
        email: "h"
    },
    {
        name: "a",
        email: "i"
    },
]

describe('Should return all values from data with given condition', () =>{

it('Should return filtered data', () => {

    const filteredData = filterByValue(exampleData, "a");

    expect(filteredData.length).toBe(5);
});

it('Should return data if filter is empty', () => {
    const filteredData = filterByValue(exampleData);

    expect(filteredData.length).toBe(exampleData.length);
});

});

describe('Should check if email is in db', () =>{

it('Should return filtered data', () => {

    const result = filterEmails(exampleData, "b");

    expect(result.length).toBe(1);
});

it('Should return true if email is missing', () => {

    const result = filterEmails(exampleData);

    expect(result).toBe(true);
});

})