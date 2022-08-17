
const init = function(){
    document.getElementById("new-course-button").addEventListener('click', NewCourseButton);
}

const NewCourseButton = function Creation(CourseName, NumberOfExams) { 

CourseName = document.getElementById('new-course-name').value;
NumberOfExams = parseInt(document.getElementById('number-of-exams').value);

//Desactivando los input momentaneamente y reseteando su valor
document.getElementById("new-course-name").disabled = true;
document.getElementById("new-course-button").disabled = true;
document.getElementById('number-of-exams').disabled = true;

document.getElementById("new-course-name").value = '';
document.getElementById('number-of-exams').value = '1';

//Ingresando en un array cada evaluación
let examsarray = [];
for (let i = 1; i <= NumberOfExams; i++) {
    examsarray.push(`Evaluacion N° ${i}`);
}

//Creando un input por cada evaluación para luego determinar su valor
examsarray.forEach(function (ExamValue) {

    const ntp = document.createElement("input");
    ntp.type = 'text';
    ntp.placeholder = `Ingrese el valor de la ${ExamValue}`;
    ntp.id = ((`${ExamValue}-of-${CourseName}`.replace(/°/g, "")).replace(/ /g, "")).toLocaleLowerCase();
    ntp.className = `percentages-to-set-${CourseName}`;
    ntp.style = 'margin-left:10px';
    document.getElementById('first-column').appendChild(ntp)
})

//Botón para almacenar los datos
const SetAndHide = document.createElement("input");
SetAndHide.type = 'button';
SetAndHide.value = 'Establecer porcentajes';
SetAndHide.id = `set-and-hide-${CourseName}`;
SetAndHide.className = 'btn btn-dark';
SetAndHide.style = 'margin-left:10px';
(document.getElementById('first-column')).appendChild(SetAndHide);

//Función tras activar el botón de almacenar datos
document.getElementById(`set-and-hide-${CourseName}`).onclick = function() {

    //Activando los input nuevamente
    document.getElementById("new-course-button").disabled = false;
    document.getElementById("new-course-name").disabled = false;
    document.getElementById('number-of-exams').disabled = false;

    //Guardando los porcentajes de los input en un array
    let percentage_input = document.getElementsByClassName(`percentages-to-set-${CourseName}`);
    let percentages_array = [];
    for (let i of percentage_input) {
        percentages_array.push(parseInt(i.value))
    }
    
    //Desapareciendo los input y el botón tras guardar data
    const percentages = document.getElementsByClassName(`percentages-to-set-${CourseName}`);
    for (let i of percentages) {
        i.style.display = 'none';
    }
    SetAndHide.style.display = 'none';

    //Creando el botón del curso que será la calculadora
    const list = document.createElement("li");
    list.className = "list-group-item";
    list.id = `course-list-for-${CourseName}`;
    list.style = "transform: rotate(0); cursor: pointer;";
    (document.getElementById('courses-ul')).appendChild(list);
    
    const btn = document.createElement("a");
    btn.setAttribute('id',`${CourseName}-calculator`.toLocaleLowerCase());
    btn.setAttribute('class', "text-warning stretched-link");
    btn.appendChild(document.createTextNode(`${CourseName}`));
    (document.getElementById(`course-list-for-${CourseName}`)).appendChild(btn);

    //Creando el objeto
    const CourseObject = {
        name:CourseName,
        number_of_exams:NumberOfExams,
        course_array:examsarray,
        each_evaluation_value:percentages_array,
        calculator:btn,       
    }

    const thisCourse = Object.create(CourseObject);
    
    //Aquí empezará la calculadora

    let each_exam_grade = [];
    
    document.getElementById(`${CourseName}-calculator`.toLocaleLowerCase()).onclick = function(){

        //Primer bucle : asignar un porcentaje a cada evaluación
        (CourseObject.course_array).forEach((evaluation,value) => {
            const percentage_value = CourseObject.each_evaluation_value[value];
            
            //Prompt por cada evaluación y almacenar la nota en un array
            let grade = 0;
            do{
                grade = parseFloat(prompt(`Ingresa tu nota en la ${evaluation} del curso de ${CourseObject.name} \n (Valor del ${percentage_value}% sobre la nota final)`));
            } while (grade > 10 || grade < 0);
            each_exam_grade.push(grade);

        }
        )

        //Actualizamos objeto con las notas de cada evaluación 
        CourseObject.each_grade = each_exam_grade;

        //Segundo bucle : asignar una nota a cada porcentaje y calcular
        let recalculated_grades_array = [];

        (CourseObject.each_evaluation_value).forEach((percentage, grade) => {
            const grade_to_calculate = CourseObject.each_grade[grade];
            const recalculated_grades = ((percentage/100)*grade_to_calculate);
            recalculated_grades_array.push(recalculated_grades)
        }
        )

        //Reduciendo el array recalculado en una nota final del curso
        const final_course_grade = recalculated_grades_array.reduce(function(acc, cur) {
            return acc + cur;
        },0
        )

        //Actualizando el objeto con la nota final
        CourseObject.final_grade = final_course_grade;

        //Desactivando la calculadora ya usada e insertando la nota como un párrafo (De momento)
        document.getElementById(`course-list-for-${CourseName}`).style = NaN

        document.getElementById(`${CourseName}-calculator`.toLocaleLowerCase()).remove();
        let disabled_p = (document.createElement('p')).appendChild(document.createTextNode(`${CourseName}`));
        (document.getElementById(`course-list-for-${CourseName}`)).appendChild(disabled_p);
        //CourseObject.calculator.className = "text-secondary";

        function CreateFinalParagrpah () {
        let DisplayCourseNote = document.createElement("p");
        DisplayCourseNote.id = `${CourseObject.name}-grade-paragraph`
        DisplayCourseNote.appendChild(document.createTextNode(`La nota del curso de ${CourseObject.name} es ${CourseObject.final_grade}`));
        (document.getElementById('third-column')).appendChild(DisplayCourseNote);

        CourseObject.final_paragraph = DisplayCourseNote.textContent;

        console.log(CourseObject.final_paragraph);
        }
        //Almacenamiento local


    }
    
}
}


document.addEventListener('DOMContentLoaded', init)

