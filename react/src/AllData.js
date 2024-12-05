import student_272727 from "./pictures/272727.png";
import student_424242 from "./pictures/424242.jpg";
import student_324455 from "./pictures/324455.jpg";


export const facultsData =    [
  {
    id: "649c2a64-88c3-4b61-b8e7-f25f09693d2",
    name: "Математический",
    dean: "Самый Лучший Мужчина",
    deputyDean: "Самая Лучшая Женщина",
  },
  {
    id: "5e73359f-2538-4f6b-9d87-a4ecdd0048f7",
    name: "Исторический",
    dean: "Владимир Ильич Ленин",
    deputyDean: "Иосиф Виссарионович Сталин",
  },
  {
    id: "e9930668-35df-482a-b773-b947481cac46",
    name: "Информационно-вычислительных технологий",
    dean: "Билли Херрингтон",
    deputyDean: "Ван Даркхолм",
  },
  {
    id: "3dddf576-c333-4856-906c-03ffe86fafb9",
    name: "Юридический",
    dean: "Ещё И Ректор",
    deputyDean: "Ноль Идей Господа",
  },
];

export const studentsData = [
    {
      id: "649c2a64-88c3-46c1-b8e7-f25f096934d2",
      studentId: "27272727",
      name: "Дело В Шляпе",
      faculty: "Шляпниковый",
      yearOfAdmission: "2027",
      level: "Кошачья",
      archive: false,
      creationDate: "27.27.2027",
      updateDate: "69.69.2069",
      department: "Винный сад",
      courseSupervisor: "Чёрный Кот Сумасшедший",
      courseWorkTitle: "Ля-ля-ля жу-жу-жу",
      courseGrade: 52,
      diplomaSupervisor: "Сигарка Блатная Щегольская",
      diplomaTitle: "Но не очко обычно губит, а к т11н туз",
      diplomaGrade: 11,
      graduationYear: "420",
      successAssessment: "Ну как сказать...",
      image: student_272727,
    },
  
    {
      id: "277c2a64-88c3-46c1-b8e7-f25f096934d2",
      studentId: "42424242",
      name: "Патрик Глейдсон Бейтман",
      faculty: "Нормальный",
      yearOfAdmission: "2042",
      level: "Хомячья",
      archive: true,
      creationDate: "42.42.2042",
      updateDate: "42.42.2042",
      department: "Котячий дом",
      courseSupervisor: "Мяу-Кот",
      courseWorkTitle:
        "Мяумяу мяу-жу hhhhhhhhhh aaaaaaaaaaaa sssssssssshhsssssssssss wwwwwwwwwwwwwww ttttttttttt",
      courseGrade: 52,
      diplomaSupervisor: "Мяяяяяяяяу мяу мяу",
      diplomaTitle:
        "Мяу hhhhhhhhhh aaaaaaaaaaaa sssssssssshhsssssssssss wwwwwwwwwwwwwww ttttttttttt hhhhhhhh ffffffffff",
      diplomaGrade: 11,
      graduationYear: "420",
      successAssessment: "Ну как сказать...",
      image: student_424242,
    },
    {
        id: "288c2a64-88c3-46c1-b8e7-f25f096934d2",
        studentId: "324455",
        name: "Алексей Агапов Комляков",
        faculty: "Приколовый",
        yearOfAdmission: "2050",
        level: "Божья",
        archive: true,
        creationDate: "32.44.2055",
        updateDate: "42.42.2055",
        department: "Церковь",
        courseSupervisor: "Господь",
        courseWorkTitle:
          "Почему важно и нужно любить Бога",
        courseGrade: 52,
        diplomaSupervisor: "Иисус",
        diplomaTitle:
          "Как понять, стоит ли ставить за человека свечку в церкви?",
        diplomaGrade: 11,
        graduationYear: "420",
        successAssessment: "Возвышенная",
        image: student_324455,
      },
];


export const departsData =   [
  {
    id: "649c2a64-88c3-46c1-b8e7-f25f096934d2",
    name: "Остров",
    head: "Самый Лучший Мужчина",
    deputy: "Самая Лучшая Женщина",
  },
  {
    id: "5e73359f-2538-4f6b-9d87-4aecdd0448f7",
    name: "Контейнер",
    head: "Илон Маск",
    deputy: "Джефф Безос",
  },
  {
    id: "e9930668-35df-482a-b773-b947481c4ca6",
    name: "Хз",
    head: "Тайлер Дёрден",
    deputy: "Никто",
  },
  {
    id: "3ddd5f76-c333-4856-906c-03ffe86fafb9",
    name: "Драконий Камень",
    head: "Патрик Бейтман",
    deputy: "Неизвестный",
  },
]


export default {studentsData, facultsData, departsData};
// export default facultsData;