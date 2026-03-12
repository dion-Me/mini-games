const ops = [
"+1",
"+2",
"-1",
"-2"
];

const goalsList = [
{
text: "IQ ≤ 10",
check: (v) => v <= 10
},
{
text: "IQ ≥ 2",
check: (v) => v >= 2
},
{
text: "IQ must be EVEN",
check: (v) => v % 2 === 0
},
{
text: "IQ must be ODD",
check: (v) => v % 2 === 1
},
{
text: "IQ between 2 and 8",
check: (v) => v >= 2 && v <= 8
}
];