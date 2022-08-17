//Este es un script antiguo, solo de referencia para estructura de la calculadora

let MathResult = 0;


const CoursesGrades = [MathResult];

const init = function(){
    document.getElementById("maths-button").addEventListener('click', Calculating);
}


const Calculating = function AverageGrade(){

    let value_one = 0;
    let value_two = 0;
    let value_three = 0;
    let value_four = 0;
    
    do{
        value_one = parseFloat(prompt('Nota del primer parcial (Valor de 20% sobre la nota final)'));
        value_two = parseFloat(prompt('Nota del segundo parcial (Valor de 15% sobre la nota final)'));
        value_three = parseFloat(prompt('Nota del tercer parcial (Valor de 25% sobre la nota final)'));
        value_four = parseFloat(prompt('Nota del examen final (Valor de 40% sobre la nota final)'));

        if (((value_one > 10) || (value_two > 10) || (value_three > 10) || ( value_four > 10)) || ((value_one < 0) || (value_two < 0) || (value_three < 0) || ( value_four < 0))){
            alert('Algo salió mal \n Recuerda que solo puedes ingresar valores entre 0 y 10 \n Por favor, inténtalo de nuevo');
        }

    } while (((value_one > 10) || (value_two > 10) || (value_three > 10) || ( value_four > 10)) || ((value_one < 0) || (value_two < 0) || (value_three < 0) || ( value_four < 0)));

    let result = (value_one * 0.2) + (value_two * 0.15) + (value_three * 0.25) + (value_four * 0.4);
    CoursesGrades[0] = result
    console.log(CoursesGrades)

    if (result >= 6){
        alert('Tu resultado final es ' + result + '\n ¡Felicidades, aprobaste!');
    } else if (result < 6){
        alert('Tu resultado final es ' + result + '\n Se necesita pasar por una evaluación suplementaria');
    }
    return result
} 


document.addEventListener('DOMContentLoaded', init)