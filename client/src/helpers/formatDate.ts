export default function formatDate(s: string) {
  const date = new Date(Date.parse(s));

  let day = `${date.getDay()}`;
  let month = `${date.getMonth()}`;
  let year = `${date.getFullYear()}`;

  if (day === "0") {
    day = "1";
  }
  if (month === "0") {
    month = "1";
  }

  if (parseInt(day) < 10) {
    day = `0${day}`;
  }
  if (parseInt(month) < 10) {
    month = `0${month}`;
  }

  return `${day}/${month}/${year}`;
}
