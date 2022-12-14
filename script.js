
const init = function(){
    document.getElementById("new-course-button").addEventListener('click', NewCourseButton);
}
//Columnas
const FirstColumn = document.getElementById('first-column');
const SecondColumn = document.getElementById('second-column');
const ThirdColumn = document.getElementById('third-column');

//Objeto del curso
let CourseObject = {};
const thisCourse = Object.create(CourseObject);

//Arrays princiaples
let all_courses = [];
let all_grades = [];

//Error de validación para los inputs
let ValidationErrorMsg = (function(ErrorText, column){
    let ErrorAlert = document.createElement('div');
    ErrorAlert.id = 'validation-error';
    ErrorAlert.className = 'alert alert-danger alert-dismissible fade show';
    ErrorAlert.setAttribute('role','alert');
    column.appendChild(ErrorAlert);

    let ErrorMsg = document.createElement('STRONG');
    ErrorMsg.id = 'validation-error-msg';
    ErrorMsg.innerText = `${ErrorText}`;
    document.getElementById('validation-error').appendChild(ErrorMsg);

    let AlertDismissal = document.createElement('button');
    AlertDismissal.id = 'alert-dismissal';
    AlertDismissal.type = 'button';
    AlertDismissal.className = 'close';
    AlertDismissal.setAttribute('data-dismiss','alert');
    AlertDismissal.setAttribute('aria-label','Close');
    document.getElementById('validation-error').appendChild(AlertDismissal);

    let AlertSpan = document.createElement('span');
    AlertSpan.id = 'validation-error-span';
    AlertSpan.setAttribute('aria-hidden','true');
    AlertSpan.innerHTML = "&times;";
    document.getElementById('alert-dismissal').appendChild(AlertSpan);
})

//Mensajes de error
const PercentagesErrorText = 'Algo salió mal, recuerda:\n• Solo puedes ingresar porcentajes entre 0 y 100 \n• La suma de tus porcentajes debe ser 100';
const PercentagesSumErrorText = `Algo salió mal, recuerda:\n• Solo puedes ingresar porcentajes entre 0 y 100 \n• La suma de tus porcentajes debe ser 100`;
const GradesErrorText = 'Algo salió mal, recuerda:\n• Solo puedes ingresar notas entre 0 y 10\n• No dejes campos en blanco';
const EmptyErrorText = 'Algo salió mal, recuerda:\n• Solo puedes ingresar notas entre 0 y 10\n• No dejes campos en blanco';
const UniqueErrorText = 'Algo salió mal, recuerda:\n• El nombre del curso no puede estar vacío\n• No puedes repetir nombres de cursos';
const RequiredCourseErrorText = 'Algo salió mal, recuerda:\n• El nombre del curso no puede estar vacío\n• No puedes repetir nombres de cursos'

//DisplayChartF (Será llamada en Ln 374 y solo se activará una vez)
var is_displayed = false;
let DisplayChartF = (function(){
        if (!is_displayed){
            is_displayed = true;
            const DisplayChart = document.createElement('button');
            DisplayChart.id = 'display-chart';
            DisplayChart.className = 'btn btn-dark';
            DisplayChart.textContent = 'Mostrar resultados';
            SecondColumn.appendChild(DisplayChart);
        }
})

//Función principal
const NewCourseButton = function Creation(CourseName, NumberOfExams) {

CourseName = document.getElementById('new-course-name').value;
NumberOfExams = parseInt(document.getElementById('number-of-exams').value);

//Tokens de validación
let UniqueCourseValidator = false;
let RequiredCourseValidator = false;

//Validación
if (all_courses.length > 0){
    for (let i of all_courses){
        if (i == CourseName || i.toLocaleLowerCase() == CourseName.toLocaleLowerCase()){
            UniqueCourseValidator = false;
            if(!document.getElementById('validation-error')){
                ValidationErrorMsg(UniqueErrorText, FirstColumn);
            }
            break;
        }else{
            if(document.getElementById('validation-error')){
                document.getElementById('validation-error').remove();
            }
            UniqueCourseValidator = true;
        }
    }
    if(UniqueCourseValidator === true){
        if (CourseName == ''){
            RequiredCourseValidator = false;
            if (!document.getElementById('validation-error')){
                ValidationErrorMsg(RequiredCourseErrorText, FirstColumn);
            }
        } else{
            RequiredCourseValidator = true;
            if(document.getElementById('validation-error')){
                document.getElementById('validation-error').remove();
            }
        }
    }
} else if (all_courses.length == 0){
    if (CourseName == ''){
        RequiredCourseValidator = false;
        if (!document.getElementById('validation-error')){
            ValidationErrorMsg(RequiredCourseErrorText, FirstColumn);
        }
    }else{
        if(document.getElementById('validation-error')){
            document.getElementById('validation-error').remove();
        }
        RequiredCourseValidator = true;
    }
}

if ((all_courses.length == 0 && RequiredCourseValidator === true) || (all_courses.length>0 && UniqueCourseValidator === true && RequiredCourseValidator === true)){
//FAQicon
const FAQimg = document.createElement('img');
    FAQimg.id = 'first-column-FAQ-two';
    FAQimg.className = 'faq rounded-circle';
    FAQimg.src = 'images/FAQicon.png';
    FAQimg.title = `Digita el valor porcentual de\ncada evaluación tomada sin\nel símbolo de porcentaje (%)`;
    FirstColumn.appendChild(FAQimg);

//Desactivando los input momentaneamente
document.getElementById("new-course-name").disabled = true;
document.getElementById("new-course-button").disabled = true;
document.getElementById('number-of-exams').disabled = true;

//Ingresando en un array cada evaluación
let examsarray = [];
for (let i = 1; i <= NumberOfExams; i++) {
    examsarray.push(`Evaluacion N° ${i}`);
}

//Creando un input por cada evaluación para luego determinar su valor
examsarray.forEach(function (ExamValue) {
    const ntp = document.createElement("input");
    ntp.type = 'number';
    ntp.placeholder = `Ingrese el valor de la ${ExamValue}`;
    ntp.id = ((`${ExamValue}-of-${CourseName}`.replace(/°/g, "")).replace(/ /g, "")).toLocaleLowerCase();
    ntp.className = `form-control percentages-to-set-${CourseName}`;
    FirstColumn.appendChild(ntp)
})

//Botón para almacenar los datos
const SetAndHide = document.createElement("input");
SetAndHide.type = 'button';
SetAndHide.value = 'Establecer porcentajes';
SetAndHide.id = `set-and-hide-${CourseName}`;
SetAndHide.className = 'btn btn-dark first-column-button percentages';
FirstColumn.appendChild(SetAndHide);

//Función tras activar el botón de almacenar datos
document.getElementById(`set-and-hide-${CourseName}`).onclick = function() {
    //Token de validación
    let PercentagesValidator = false;

    //Guardando los porcentajes de los input en un array
    let percentage_input = document.getElementsByClassName(`percentages-to-set-${CourseName}`);
    let percentages_array = [];
    for (let i of percentage_input) {
        percentages_array.push(parseInt(i.value));
    }

    //Array reducido
    let percentages_sum = percentages_array.reduce(function(acc, cur) {
        return acc + cur;
    },0);

    //Validando
    for (let i of percentages_array){
        if (i < 0 || i > 100){
            PercentagesValidator = false;
            percentages_array = [];            
            if (!document.getElementById('validation-error')){
            ValidationErrorMsg(PercentagesErrorText, FirstColumn);
            }
            break;  
        } else{
            if (document.getElementById('validation-error')){
                document.getElementById('validation-error').remove();
            }
            PercentagesValidator = true;
        }
    }

    //Solo permite la segunda validación si la primera se cumple
    if (PercentagesValidator === true){
    if (percentages_sum != 100){
        PercentagesValidator = false;
        percentages_array = [];
        if (!document.getElementById('validation-error')){
            ValidationErrorMsg(PercentagesSumErrorText, FirstColumn);
        }
        percentages_sum = 0;
    } else{
        PercentagesValidator = true;
    }

    if (PercentagesValidator === true){
    //Restableciendo valores
    document.getElementById("new-course-name").value = '';
    document.getElementById('number-of-exams').value = '1';

    //Eliminando el FAQ de porcentajes
    document.getElementById('first-column-FAQ-two').remove();

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

    //Desestructurando el objeto
    const {
        name:theCourseName,
        number_of_exams:theCourseNumberOfExams,
        course_array:theCourseCourseArray,
        each_evaluation_value:theCourseEachEvaluation,
        calculator:theCourseCalculator,
    } = CourseObject
       
    //Aquí empezará la calculadora
    let each_exam_grade = [];
    
    document.getElementById(`${CourseName}-calculator`.toLocaleLowerCase()).onclick = function(){
        //Desapareciendo momentaneamente el <ul> de la secund-column
        var ul_to_hide = document.getElementById('courses-ul');
        ul_to_hide.style.display = 'none';
        var btn_to_hide = document.getElementById('display-chart');
        if (SecondColumn.contains(btn_to_hide)){
            btn_to_hide.style.display = 'none';
        }
        
        //Creando nuevos <ul>
        const ul_inputs = document.createElement('ul');
        ul_inputs.id = `${CourseName}-input-ul`;
        ul_inputs.className = 'list-group list-group-flush';
        SecondColumn.appendChild(ul_inputs);

            //Primer bucle : asignar un porcentaje a cada evaluación
            (theCourseCourseArray).forEach((evaluation,value) => {
            const percentage_value = theCourseEachEvaluation[value]; 

            //Creando los nuevo <li> <input> que serán insertados en el <ul> de la second-column
            const li_inputs = document.createElement('li');
            li_inputs.id = ((`${evaluation}-of-${CourseName}-input-li`.replace(/°/g, "")).replace(/ /g, "")).toLocaleLowerCase();
            li_inputs.className = "list-group-item";
            (document.getElementById(`${CourseName}-input-ul`).appendChild(li_inputs));

            //Inputs para el usuario
            const text_input = document.createElement('input');
            text_input.type = 'number';
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
            SecondColumn.appendChild(SendAndShow);

            //Iniciando el evento para calcular notas
            document.getElementById('send-and-show-button').onclick = function() {
            //Token de validación
            let GradesValidator = false;

            //Guardándo las notas en un array
            const entered_grades = document.getElementsByClassName('grade-input');
            for (let i of entered_grades){
                const the_grade = i.value;
                each_exam_grade.push(the_grade);
            }

            //Validando las notas
            for (let i of each_exam_grade){
                if (i < 0 || i > 10){
                    GradesValidator = false;
                    each_exam_grade = [];
                    if (!document.getElementById('validation-error')){
                        ValidationErrorMsg(GradesErrorText, ThirdColumn);
                    }
                    break;
                } else if(i == ''){
                    GradesValidator = false;
                    each_exam_grade = [];
                    if (!document.getElementById('validation-error')){
                        ValidationErrorMsg(EmptyErrorText, ThirdColumn);
                    }
                    break;
                } else{
                    if (document.getElementById('validation-error')){
                        document.getElementById('validation-error').remove();
                    }
                    GradesValidator = true;
                }
            }

            if (GradesValidator === true){       
            //Removemos el <ul> que contiene los <li> e <input> y volvemos a mostrar el primer <ul>
            document.getElementById(`${CourseName}-input-ul`).remove();
            document.getElementById('send-and-show-button').remove();
            ul_to_hide.style.display = 'block';
            if (SecondColumn.contains(btn_to_hide)){
                btn_to_hide.style.display = 'block';
            }

            //Actualizamos objeto con las notas de cada evaluación 
            CourseObject.each_grade = each_exam_grade;
            const {each_grade:theCourseEachGrade} = CourseObject;

            //Segundo bucle : asignar una nota a cada porcentaje y calcular
            let recalculated_grades_array = [];

            theCourseEachEvaluation.forEach((percentage, grade) => {
                const grade_to_calculate = theCourseEachGrade[grade];
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
            const {final_grade:theCourseFinalGrade} = CourseObject;

            //Desactivando la calculadora ya usada e insertando la nota como un párrafo (De momento)
            document.getElementById(`course-list-for-${CourseName}`).style = NaN

            document.getElementById(`${CourseName}-calculator`.toLocaleLowerCase()).remove();
            let disabled_p = (document.createElement('p')).appendChild(document.createTextNode(`${CourseName}`));
            (document.getElementById(`course-list-for-${CourseName}`)).appendChild(disabled_p);

            //Pusheando los resultados
            all_courses.push(theCourseName);
            all_grades.push(theCourseFinalGrade);

            //Llamando a DisplayChartF (Ln 56)
            DisplayChartF();

            //Almacenamiento local
            localStorage.setItem('courses-serialized', '[]');
            let courses_deserialized = JSON.parse(localStorage.getItem('courses-serialized'));
            courses_deserialized.push(...all_courses);
            localStorage.setItem('courses-serialized', JSON.stringify(courses_deserialized));

            localStorage.setItem('grades-serialized', '[]');
            let grades_deserialized = JSON.parse(localStorage.getItem('grades-serialized'));
            grades_deserialized.push(...all_grades);
            localStorage.setItem('grades-serialized', JSON.stringify(grades_deserialized));

            //Activando los input nuevamente
            document.getElementById("new-course-button").disabled = false;
            document.getElementById("new-course-name").disabled = false;
            document.getElementById('number-of-exams').disabled = false; 

        //Ejecución de Charts JS 
        document.getElementById('display-chart').onclick = function() {
            //Listando aprobados y desaprobados
            let approved_courses = [];
            let disapproved_courses = [];
            for (let i of all_grades){
                i < 6 ? disapproved_courses.push(i) : approved_courses.push(i);
            }

            const ApprovedHeader = document.getElementById('approved-courses');
            const DisapprovedHeader = document.getElementById('disapproved-courses');

            ApprovedHeader.textContent = `Cursos aprobados : ${approved_courses.length}`;
            DisapprovedHeader.textContent = `Cursos desaprobados : ${disapproved_courses.length}`;

            localStorage.setItem('approved-serialized',JSON.stringify(ApprovedHeader.textContent));
            localStorage.setItem('disapproved-serialized',JSON.stringify(DisapprovedHeader.textContent));

            //Desactivando todos los botones e inputs
            document.getElementById("new-course-button").disabled = true;
            document.getElementById("new-course-name").disabled = true;
            document.getElementById('number-of-exams').disabled = true;
            document.getElementById('display-chart').disabled = true;

            //Contenedores para el chart
            const ChartDiv = document.createElement('div');
            ChartDiv.id = 'chart-div';
            ChartDiv.className = 'chart-container';
            (document.getElementById('chart-card')).appendChild(ChartDiv);

            const ChartCanvas = document.createElement("canvas");
            ChartCanvas.id = 'myChart';
            (document.getElementById('chart-div')).appendChild(ChartCanvas);

            //Asignando color a las barras
            const BarColor = [];
            for (let i = 0; i < all_grades.length; i++) {
                all_grades[i] < 6 ? BarColor.push('rgb(255,105,97)') : BarColor.push('rgb(133,222,119)'); // rojo : verde
            }

            //Chart
            let myChart = (document.getElementById('myChart')).getContext('2d');
            
            let gradesChart = new Chart(myChart,{
                type: 'bar',
                data:{
                    labels: [...all_courses],
                    datasets: [{
                        label: 'Resultados del bimestre',
                        data: [...all_grades],
                        backgroundColor: BarColor
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis:'y',
                    scales:{
                        x:{
                            min:0,
                            max:10,
                            ticks:{
                                stepSize:1
                            }
                        },
                        y:{
                            grid:{
                                offset: false,
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
            
            //Botón de reseteo
            const ResetData = document.createElement('button');
            ResetData.id = 'reset-grades-button';
            ResetData.className = 'btn btn-dark';
            ResetData.textContent = 'Resetear';
            (document.getElementById('chart-card')).appendChild(ResetData);

            document.getElementById('reset-grades-button').onclick = function() {
                localStorage.clear();
                document.location.reload();
            }

            //Quickchart API
            //API que transforma el gráfico en un link, lo usaremos para crear un botón de descarga
            const all_courses_serialized = JSON.stringify(all_courses);
            const BarColor_serialized = JSON.stringify(BarColor);

            const GraphUrl = encodeURI(`https://quickchart.io/chart?c={type:'horizontalBar',data:{labels:${all_courses_serialized},datasets:[{label:'Resultados del bimestre',data:[${all_grades}],backgroundColor:${BarColor_serialized}}]},options:{scales:{xAxes:[{ticks:{min:0,max:10,}}]}}}`);
 
            (async () => {
                //Fetch
                const response = await fetch(GraphUrl)
                const imageBlob = await response.blob()
                const reader = new FileReader();
                reader.readAsDataURL(imageBlob);
                reader.onloadend = () => {
                  const base64data = reader.result;
                  localStorage.setItem('download-serialized', JSON.stringify(base64data));
                    
                  //Creando el botón y el link para descargar
                  const imgDownload = document.createElement('a');
                  imgDownload.id = 'results-to-download'
                  imgDownload.href = base64data;
                  imgDownload.download = 'resultados_del_bimestre.png';
                  document.getElementById('chart-card').appendChild(imgDownload);

                  const base64_img = document.createElement('button');
                  base64_img.textContent = 'Descargar';
                  base64_img.className = 'btn btn-success';
                  document.getElementById('results-to-download').appendChild(base64_img);
                }
              })();
        }
        }   
        }       
    }
}
}   
}
}
}

//Carga el DOM
window.addEventListener('DOMContentLoaded',() => {
    //Si hay data en localStorage...
    if(localStorage.length>0){
        //Deshabilita inputs
        document.getElementById("new-course-button").disabled = true;
        document.getElementById("new-course-name").disabled = true;
        document.getElementById('number-of-exams').disabled = true;

        //Activa el toast en index.html Ln 33
        const ToastAlert = document.getElementById('graph-alert');
        ToastAlert.style.display = 'block';
        $(document).ready(function(){
            $('.toast').toast('show');
        })

        //Recupera el listado de aprobados y desaprovados
        let ApprovedDeserialized = JSON.parse(localStorage.getItem('approved-serialized'));
        let DisapprovedDeserialized = JSON.parse(localStorage.getItem('disapproved-serialized'));

        let RestoredApproved = document.getElementById('approved-courses');
        let RestoredDisapproved = document.getElementById('disapproved-courses');

        RestoredApproved.textContent = ApprovedDeserialized;
        RestoredDisapproved.textContent = DisapprovedDeserialized;

        //Recupera el chart
        let gradesChart_labels = JSON.parse(localStorage.getItem('courses-serialized'));
        let gradesChart_dataset = JSON.parse(localStorage.getItem('grades-serialized'));

        const RestoredChartDiv = document.createElement('div');
        RestoredChartDiv.id = 'restored-chart-div';
        RestoredChartDiv.className = 'chart-container';
        (document.getElementById('chart-card')).appendChild(RestoredChartDiv);

        const RestoredChartCanvas = document.createElement("canvas");
        RestoredChartCanvas.id = 'myChart';
        (document.getElementById('restored-chart-div')).appendChild(RestoredChartCanvas);

        const RestoredBarColor = [];
            for (let i = 0; i < gradesChart_dataset.length; i++) {
                gradesChart_dataset[i] < 6 ? RestoredBarColor.push('#ff6961') : RestoredBarColor.push('#85de77'); 
            }

        let myChart = (document.getElementById('myChart')).getContext('2d');
        
        let gradesChart = new Chart(myChart,{
            type: 'bar',
            data:{
                labels: [...gradesChart_labels],
                datasets: [{
                    label: 'Resultados del bimestre',
                    data: [...gradesChart_dataset],
                    backgroundColor: RestoredBarColor,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis:'y',
                scales:{
                    x:{
                        min:0,
                        max:10,
                        ticks:{
                            stepSize:1
                        }
                    },
                    y:{
                        grid:{
                            offset: false,
                        },
                        beginAtZero: true
                    }
                }
            }
        })

        //Recupera el botón de reseteo
        const RestoredResetData = document.createElement('button');
        RestoredResetData.id = 'reset-grades-button';
        RestoredResetData.className = 'btn btn-dark';
        RestoredResetData.textContent = 'Resetear';
        (document.getElementById('chart-card')).appendChild(RestoredResetData);

        document.getElementById('reset-grades-button').onclick = function() {
            localStorage.clear();
            document.location.reload();
        }

        //Recupera el link de descarga
        let DownloadDeserialized = JSON.parse(localStorage.getItem('download-serialized'));        

        const RestoredimgDownload = document.createElement('a');
        RestoredimgDownload.id = 'results-to-download'
        RestoredimgDownload.href = DownloadDeserialized;
        RestoredimgDownload.download = 'resultados_del_bimestre.png';
        document.getElementById('chart-card').appendChild(RestoredimgDownload);

        const restored_base64_img = document.createElement('button');
        restored_base64_img.textContent = 'Descargar';
        restored_base64_img.className = 'btn btn-success';
        document.getElementById('results-to-download').appendChild(restored_base64_img);
    }   
}
)

document.addEventListener('DOMContentLoaded', init);