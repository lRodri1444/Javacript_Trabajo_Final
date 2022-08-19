
const init = function(){
    document.getElementById("new-course-button").addEventListener('click', NewCourseButton);
}

let CourseObject = {};
const thisCourse = Object.create(CourseObject);

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

    //Guardando los porcentajes de los input en un array
    let percentage_input = document.getElementsByClassName(`percentages-to-set-${CourseName}`);
    let percentages_array = [];
    for (let i of percentage_input) {
        percentages_array.push(parseInt(i.value));
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

    //Actualizando el objeto
    CourseObject.name=CourseName;
    CourseObject.number_of_exams=NumberOfExams;
    CourseObject.course_array=examsarray;
    CourseObject.each_evaluation_value=percentages_array;
    CourseObject.calculator=btn;
       
    //Aquí empezará la calculadora
    let each_exam_grade = [];
    
    document.getElementById(`${CourseName}-calculator`.toLocaleLowerCase()).onclick = function(){
        //Desapareciendo momentaneamente el <ul> de la secund-column
        var ul_to_hide = document.getElementById('courses-ul');
        ul_to_hide.style.display = 'none';

        //Creando nuevos <ul>
        const ul_inputs = document.createElement('ul');
        ul_inputs.id = `${CourseName}-input-ul`;
        ul_inputs.className = 'list-group list-group-flush';
        (document.getElementById('second-column')).appendChild(ul_inputs);

        //Primer bucle : asignar un porcentaje a cada evaluación
        (CourseObject.course_array).forEach((evaluation,value) => {
            const percentage_value = CourseObject.each_evaluation_value[value]; 

            //Creando los nuevo <li> <input> que serán insertados en el <ul> de la second-column
            const li_inputs = document.createElement('li');
            li_inputs.id = ((`${evaluation}-of-${CourseName}-input-li`.replace(/°/g, "")).replace(/ /g, "")).toLocaleLowerCase();
            li_inputs.className = "list-group-item";
            (document.getElementById(`${CourseName}-input-ul`).appendChild(li_inputs));

            const text_input = document.createElement('input');
            text_input.type = 'text';
            text_input.placeholder = `Nota de ${evaluation} (${percentage_value}%)`;
            text_input.id = ((`${evaluation}-of-${CourseName}-input-text`.replace(/°/g, "")).replace(/ /g, "")).toLocaleLowerCase();
            text_input.className = 'form-control grade-input';
            (document.getElementById(((`${evaluation}-of-${CourseName}-input-li`.replace(/°/g, "")).replace(/ /g, "")).toLocaleLowerCase())).appendChild(text_input);

        }
        )

        //Botón para enviar data
        const SendAndShow = document.createElement('button');
        SendAndShow.textContent = 'Calcular';
        SendAndShow.id = 'send-and-show-button';
        SendAndShow.className = 'btn btn-dark';
        document.getElementById('second-column').appendChild(SendAndShow);

        //Iniciando el evento del botón
        document.getElementById('send-and-show-button').onclick = function() {

            //Looping a través de los input y guardándolos el valor en un array
            const entered_grades = document.getElementsByClassName('grade-input');
            for (let i of entered_grades){
                const the_grade = i.value;
                each_exam_grade.push(the_grade);
            }
            console.log(each_exam_grade);

            //Removemos el <ul> que contiene los <li> e <input> y volvemos a mostrar el primer <ul>
            document.getElementById(`${CourseName}-input-ul`).remove();
            document.getElementById('send-and-show-button').remove();
            ul_to_hide.style.display = 'block';

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

        let DisplayCourseNote = document.createElement("p");
        DisplayCourseNote.id = `${CourseObject.name}-grade-paragraph`
        DisplayCourseNote.appendChild(document.createTextNode(`La nota del curso de ${CourseObject.name} es ${CourseObject.final_grade}`));
        (document.getElementById('third-column')).appendChild(DisplayCourseNote);

        //Actualizando el objeto con la nota final
        CourseObject.final_paragraph = DisplayCourseNote.textContent;

        console.log(CourseObject.final_paragraph);
        
        //Almacenamiento local 
        localStorage.setItem(CourseObject.name, JSON.stringify(CourseObject.final_paragraph));
        
        //Activando los input nuevamente
        document.getElementById("new-course-button").disabled = false;
        document.getElementById("new-course-name").disabled = false;
        document.getElementById('number-of-exams').disabled = false;      
        }      
    }   
}
}
//Carga las notas del párrafo final solo si hay elementos en localstorage
window.addEventListener('DOMContentLoaded',() => {

    for (let i = 0; i < localStorage.length; i++){
        let key = localStorage.key(i);
        let item = JSON.parse(localStorage.getItem(key));

        let RestoredDisplayCourseNote = document.createElement('p');
        RestoredDisplayCourseNote.textContent = item;
        (document.getElementById('third-column')).appendChild(RestoredDisplayCourseNote);
    } 

    //Mostrar un botton de reset si hay elementos en localStorage
    if(localStorage.length>0){
        const ResetData = document.createElement('button');
        ResetData.id = 'reset-grades-button';
        ResetData.className = 'btn btn-dark';
        ResetData.textContent = 'Resetear';
        (document.getElementById('third-column')).appendChild(ResetData);

        document.getElementById('reset-grades-button').onclick = function() {
            localStorage.clear();
            document.location.reload();
        }
    }
}
)


document.addEventListener('DOMContentLoaded', init)

