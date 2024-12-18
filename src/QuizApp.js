import React, {useState, useEffect, useCallback} from 'react';
import {Button} from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

//Sample quiz questions
const QUIZ_QUESTIONS=[
    {
        question: "What is the capital of France?",
        options:["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: "Paris"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars"
    },
    {
        question: "What is 2+2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4"
    }
];
const QuizApp = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex]=useState(0);
    const [selectedAnswer, setSelectedAnswer]= useState(null);
    const [score, setScore]=useState(0);
    const [timeLeft, setTimeLeft]= useState(15);
    const [quizCompleted, setQuizCompleted] = useState(false);

    //Randomize questions on initial load
    const [randomizedQuestions]=useState(() =>
    [...QUIZ_QUESTIONS].sort(()=> Math.random()-0.5)
);

//Timer effect
useEffect(()=>{
    if (quizCompleted || timeLeft===0) return;

    const timerId=setInterval(()=>{
        setTimeLeft(prev =>{
            if (prev === 1){
                handleNextQuestion(false);
                return 15;
            }
            return prev - 1;
        });
    }, 1000);

    return ()=> clearInterval(timerId);
}, [currentQuestionIndex, quizCompleted, timeLeft]);

const handleAnswerSelect=(answer)=>{
    setSelectedAnswer(answer);

    if (answer === randomizedQuestions[currentQuestionIndex].correctAnswer){
        setScore((prev) => prev +1);
    }

    setTimeout(()=>{
        handleNextQuestion(true);
    }, 500);
};

const handleNextQuestion= useCallback((wasAnswered=false)=>{
    setTimeLeft(15);
    setSelectedAnswer(null);

    if(currentQuestionIndex + 1<randomizedQuestions.length){
        setCurrentQuestionIndex(prev => prev + 1);
    }else{
        setQuizCompleted(true);
    }
}, [currentQuestionIndex, randomizedQuestions.length]);

const restartQuiz =() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setQuizCompleted(false);
    setTimeLeft(15);
};

if (quizCompleted){
    return (
        <Card className="w-96 mx-auto mt-10">
            <CardHeader>
                <CardTitle>Quiz Completed!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-2xl mb-4">
                    Your Score: {score}/{randomizedQuestions.length}
                </p>
                <Button onClick={restartQuiz} className="w-full">
                    Restart Quiz
                </Button>
            </CardContent>
        </Card>
    );
}

const currentQuestion= randomizedQuestions[currentQuestionIndex];

return (
    <Card className="w-96 mx-auto mt-10">
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Quiz Time!</CardTitle>
                <div className="text-red-500 font-bold">
                    Time Left: {timeLeft}s
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="mb-4">
                <p className="text-xl mb-4">{currentQuestion.question}</p>

                {currentQuestion.options.map((option)=>(
                    <Button
                    key={option}
                    onClick={()=> handleAnswerSelect(option)}
                    className={`w-full mb-2 ${
                        selectedAnswer === option
                            ? option === currentQuestion.correctAnswer
                                ?'bg-green-500 hover:bg-green-600'
                                :'bg-red-500 hover:bg-red-600'
                            :''
                    }`}
                    disabled={selectedAnswer !== null}>
                        {option}
                    </Button>
                
                ))}
            </div>

            <div className="text-center">
                Question {currentQuestionIndex + 1} of {randomizedQuestions.length}
            </div>
        </CardContent>
    </Card>
);
};

export default QuizApp;