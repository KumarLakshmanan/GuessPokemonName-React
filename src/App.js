import React, { useState, useEffect } from "react";
import pokeMonData from "./data";

const App = () => {
	const [score, setScore] = useState(0);
	const [isStart, setisStart] = useState(true);
	const [correctAnswer, setCorrectAnswer] = useState({
		name: "",
		img: "",
	});
	const [isBegin, setisBegin] = useState(false);
	const [allOptions, setAllOptions] = useState([]);
	const [radioValue, setRadioValue] = useState("");

	const URL = "https://pokeapi.co/api/v2/pokemon/";
	const OPTIONS_COUNT = 4;
	const resetBoard = () => {
		setisBegin(false);
		setCorrectAnswer({
			name: "",
			img: "",
		});
		setRadioValue("");
		setAllOptions([]);
	};

	useEffect(() => {
		if (isBegin && allOptions.length === 0) {
			let answers = [];
			let score = 0;
			if (localStorage.getItem("score")) {
				score = localStorage.getItem("score");
			}
			for (let index = 0; index < OPTIONS_COUNT; index++) {
				let selected =
					pokeMonData[Math.floor(Math.random() * pokeMonData.length)];
				while (answers.includes(selected)) {
					selected =
						pokeMonData[
							Math.floor(Math.random() * pokeMonData.length)
						];
				}
				answers.push(selected);
			}
			fetch(URL + answers[Math.floor(Math.random() * OPTIONS_COUNT)])
				.then((res) => res.json())
				.then((data) => {
					setCorrectAnswer({
						name: data.name,
						img: data.sprites.front_default,
					});
				})
				.catch((error) => {
					if (window.confirm("There is Some Error while Loading")) {
						resetBoard();
					}
				});
			setScore(score);
			setisStart(false);
			setAllOptions(answers);
		}
	}, [score, correctAnswer, allOptions, isBegin]);

	const checkAnswer = () => {
		let dummyscore = parseInt(score);
		if (!radioValue) {
			alert("Please Select Some Options");
		} else if (correctAnswer.name === radioValue) {
			alert("Correct Answer");
			localStorage.setItem("score", dummyscore + 1);
			resetBoard();
		} else if (correctAnswer.name === "") {
			alert("Please Wait The Image is Still Loading");
		} else {
			alert("Wrong Answer");
		}
	};

	const onRadioChange = (name) => {
		setRadioValue(name);
	};

	return (
		<div className='form'>
			<span className='score'>Score : {score}</span>
			{!isBegin ? (
				<div className={"flex-center"}>
					<button
						className='btnSubmit'
						onClick={() => setisBegin(true)}
					>
						{isStart ? "Start Pokemon Quiz" : "Go to Next Question"}
					</button>
				</div>
			) : (
				<>
					<div className='image'>
						{correctAnswer.img ? (
							<img src={correctAnswer.img} alt='Loading' />
						) : (
							<div className='container'>
								<div className='box1'></div>
								<div className='box2'></div>
								<div className='box3'></div>
							</div>
						)}
					</div>
					<div className='pokemon'>
						{allOptions.map((element, i) => {
							return (
								<div
									key={i}
									className={
										element === radioValue
											? "active inputGroup"
											: "inputGroup"
									}
								>
									<label htmlFor={i}> {element}</label>
									<input
										type='radio'
										id={i}
										value={element}
										checked={element === radioValue}
										onChange={() => onRadioChange(element)}
									/>
								</div>
							);
						})}
					</div>
					<button className='btnSubmit' onClick={checkAnswer}>
						Check Answer
					</button>
				</>
			)}
		</div>
	);
};

export default App;
