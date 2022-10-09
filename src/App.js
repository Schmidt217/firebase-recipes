import "./App.css";
import { useEffect, useState } from "react";
import FirebaseAuthService from "./FirebaseAuthService";
import LoginForm from "./components/LoginForm";
import AddEditRecipeForm from "./components/AddEditRecipeForm";
import FirebaseFirestoreService from "./FirebaseFirestoreService";

function App() {
	const [user, setUser] = useState(null);
	const [currentRecipe, setCurrentRecipe] = useState(null);
	const [recipes, setRecipes] = useState([]);

	FirebaseAuthService.subscribeToAuthChanges(setUser);

	useEffect(() => {
		fetchRecipes()
			.then((fetchedRecipes) => {
				setRecipes(fetchedRecipes);
			})
			.catch((error) => {
				console.log(error);
				throw error;
			});
		// eslint-disable-next-line
	}, [user]);

	async function fetchRecipes() {
		const queries = [];

		if (!user) {
			queries.push({
				field: "isPublished",
				condition: "==",
				value: true,
			});
		}

		let fetchedRecipes = [];

		try {
			const res = await FirebaseFirestoreService.readDocuments(
				"recipes",
				queries
			);
			const newRecipes = res.docs.map((recipeDoc) => {
				const id = recipeDoc.id;
				const data = recipeDoc.data();
				data.publishDate = new Date(data.publishDate.seconds * 1000);

				return { ...data, id };
			});

			fetchedRecipes = [...newRecipes];
		} catch (error) {
			console.log(error);
		}
		return fetchedRecipes;
	}

	async function handleFetchRecipes() {
		try {
			const fetchedRecipes = await fetchRecipes();

			setRecipes(fetchedRecipes);
		} catch (error) {
			console.error(error.message);
			throw error;
		}
	}

	async function handleAddRecipe(newRecipe) {
		try {
			const response = await FirebaseFirestoreService.createDocument(
				"recipes",
				newRecipe
			);

			handleFetchRecipes();

			alert(`successfully created a recipe with an id = ${response.id}`);
		} catch (error) {
			console.log(error.message);
		}
	}

	async function handleUpdateRecipe(newRecipe, recipeId) {
		try {
			await FirebaseFirestoreService.updateDocument(
				"recipes",
				recipeId,
				newRecipe
			);
			handleFetchRecipes();
			alert(`successfully updated a recipe with an id of ${recipeId}`);
			// setCurrentRecipe(null);
		} catch (error) {
			console.log(error);
		}
	}

	function handleEditRecipeClick(recipeId) {
		const selectedRecipe = recipes.find((recipe) => recipe.id === recipeId);
		console.log(recipeId);
		console.log(selectedRecipe);

		if (selectedRecipe) {
			setCurrentRecipe(selectedRecipe);
		}

		window.scrollTo(0, document.body.scrollHeight);
	}

	function handleEditRecipeCancel() {
		setCurrentRecipe(null);
	}

	function lookupCategoryLabel(categoryKey) {
		const categories = {
			breadsSandwichesAndPizza: "Breads Sandwiches, and Pizza",
			eggsAndBreakfast: "Eggs & Breakfast",
			dessertsAndBakedGoods: "Desserts & Baked Goods",
			fishAndSeafood: "Fish & Seafood",
			vegetables: "Vegetables",
		};

		const label = categories[categoryKey];
		return label;
	}

	function formatDte(date) {
		const day = date.getUTCDate();
		const month = date.getUTCMonth() + 1;
		const year = date.getFullYear();

		const dateString = `${month}/${day}/${year}`;
		return dateString;
	}

	return (
		<div className="App">
			<div className="title-row">
				<h1 className="title">Firebase Recipes</h1>
				<LoginForm existingUser={user} />
			</div>
			<div className="main">
				<div className="center">
					<div className="recipe-list-box">
						{recipes && recipes.length > 0 ? (
							<div className="recipe-list">
								{recipes.map((recipe) => {
									return (
										<div className="recipe-card" key={recipe.id}>
											{recipe.isPublished === false ? (
												<div className="unpublished">UNPUBLISHED</div>
											) : null}
											<div className="recipe-name">{recipe.name}</div>
											<div className="recipe-field">
												Category: {lookupCategoryLabel(recipe.category)}
											</div>
											<div className="recipe-field">
												Publish Date: {formatDte(recipe.publishDate)}
											</div>
											{user ? (
												<button
													type="button"
													className="primary-button edit-button"
													onClick={() => handleEditRecipeClick(recipe.id)}
												>
													EDIT
												</button>
											) : null}
										</div>
									);
								})}
							</div>
						) : null}
					</div>
				</div>
				{user ? (
					<AddEditRecipeForm
						existingRecipe={currentRecipe}
						handleAddRecipe={handleAddRecipe}
						handleUpdateRecipe={handleUpdateRecipe}
						handleEditRecipeCancel={handleEditRecipeCancel}
					/>
				) : null}
			</div>
		</div>
	);
}

export default App;
