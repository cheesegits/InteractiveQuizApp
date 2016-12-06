// Module-level global vars

var state = {
    secCount: 7,
    current: 0,
    score: {
        correct: 0,
        incorrect: 0
    },
    answerFeedback: [],
    quizScore: [],
    questionsList: [{
        id: '0',
        question: 'Basil grows well next to all of these plants except:',
        answers: ['Chard', 'Cucumber', 'Tomato', 'Apricot'],
        correct: 'Chard'
    }, {
        id: '1',
        question: 'Beans grow well next to:',
        answers: ['Garlic', 'Onions', 'Chives', 'None of the above'],
        correct: 'None of the above'
    }, {
        id: '2',
        question: 'Celery grows well next to everything except:',
        answers: ['Peas', 'Tomato', 'Cauliflower', 'Potatoes'],
        correct: 'Potatoes'
    }, {
        id: '3',
        question: 'Cucumbers grow well next to everything except:',
        answers: ['Brocoli', 'Brussel Sprouts', 'Potatoes', 'Corn'],
        correct: 'Potatoes'
    }, {
        id: '4',
        question: 'Garlic grows well next to:',
        answers: ['Beans', 'Parsely', 'Strawberry', 'None of the above'],
        correct: 'None of the above'
    }]
};

// State management - Functions that change the state

function increaseCurrent(state) {
    state.current++;
}

function secCountReset(state) {
    state.secCount = 7;
}

function scoreCount(state, boolean) {
    if (boolean) {
        state.score.correct++;
    } else {
        state.score.incorrect++;
    }
}

function resetState(state) {
    state.current = 0;
    state.score.correct = 0;
    state.score.incorrect = 0;
}

// DOM manipulation - Functions that update the HTML with new state

function generateQuestion(state) {
    $('#question-number').text("Question " + (state.current + 1) + " of 5");
    $('#question').text(state.questionsList[state.current].question);
    for (var i = 0; i < state.questionsList[state.current].answers.length; i++) {
        $('#answer-choices').append('<li><input type="radio" name="radio" value="' + state.questionsList[state.current].answers[i] + '"</input>' + state.questionsList[state.current].answers[i] + '</li>');
    }
}

function scoreHTML(state, boolean) {
    if (boolean) {
        $('#answer-feedback').text("Correct!");
        $('#quiz-score').text(state.score.correct + ' correct. ' + state.score.incorrect + ' incorrect');
    } else {
        $('#answer-feedback').text("Incorrect. The correct answer is: " + state.questionsList[state.current].correct + ".");
        $('#quiz-score').text(state.score.correct + ' correct. ' + state.score.incorrect + ' incorrect');
    }
}

function nextQuestion(state) {
    if (state.current < 4) {
        $('#question-number').empty();
        $('#question').empty();
        $('#answer-choices').empty();
        $('#answer-feedback').empty();
        $('#button-submit').text("Submit");
        //secCountReset(state);
/*        
        Issue: Calling secCountReset(state) (above) triggers the secCounter() to loop twice and stop.
        Solution: If secCountReset(state) is located at the start of verifyAnswer then it works correctly.
        Preference 1: secCounter() doesn't loop twice - call clearTimeout() after setTimeout() inside verifyQuestion()?
        Preference 2: secCountReset(state) is placed here with the rest of the state/DOM resets when loading the nextQuestion.
*/        
        increaseCurrent(state);
        generateQuestion(state);    
    } else {
        $('#question-number').empty();
        $('#question').empty();
        $('#answer-choices').empty();
        $('#answer-feedback').empty();
        endQuiz();
    }
}

function secCounter() {
    if(state.secCount > 0) {
        $('#button-submit').text("Next question in " + state.secCount + " seconds");
        var timer = setTimeout(secCounter, 1000);
        state.secCount--;
    }
}

function endQuiz() {
    $('#companion-plant-quiz').hide();
    $('#answer-feedback').text("Final score: " + (state.score.correct / 5 * 100).toFixed(0) + "%");
    $('#quiz-score').text("Would you like to play again?")
}

// Event listeners

function verifyQuestion(state) {
    $('#companion-plant-quiz').submit(function(event) {
        event.preventDefault();
        secCountReset(state);
        var correctAnswer = state.questionsList[state.current].correct;
        var userAnswer = $('input[name="radio"]:checked', $(this)).val();
        if (userAnswer === undefined) {
            return alert("Please select an answer.");
        }
        if (userAnswer === correctAnswer) {
            scoreCount(state, true);
            scoreHTML(state, true);
            setTimeout(secCounter, 0);
            setTimeout(nextQuestion, 7000, state);
        } else {
            scoreCount(state, false);
            scoreHTML(state, false);
            setTimeout(secCounter, 0);
            setTimeout(nextQuestion, 7000, state);
        }
    });
}

function startNewGame(state) {
    $('#start-new-game').click(function(event) {
        event.preventDefault();
        $('#question-number').empty();
        $('#question').empty();
        $('#answer-choices').empty();
        $('#answer-feedback').empty();
        $('#quiz-score').empty();
        $('#companion-plant-quiz').show();
        resetState(state);
        generateQuestion(state);
    });

}

// Main function

$(function() {
    generateQuestion(state);
    verifyQuestion(state);
    startNewGame(state);
});
