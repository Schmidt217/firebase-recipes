import "./App.css";
import { useEffect, useState } from "react";
import FirebaseAuthService from "./FirebaseAuthService";
import LoginForm from "./components/LoginForm";
import AddEditRecipeForm from "./components/AddEditRecipeForm";
import FirebaseFirestoreService from "./FirebaseFirestoreService";

function App() {
	const [user, setUser] = useState(null);
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
	}, [user]);

	async function fetchRecipes() {
		let fetchedRecipes = [];

		try {
			const res = await FirebaseFirestoreService.readDocuments("recipes");
			const newRecipes = res.docs.map((recipeDoc) => {
				const id = recipeDoc.id;
				const data = recipeDoc.data();
				data.publishDate = new Date(data.publishDate.seconds * 1000);

				return { ...data, id };
			});

			fetchedRecipes = [...newRecipes];
		} catch (error) {
			alert(error.message);
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
			// alert(error.message);
			console.log(error.message);
		}
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
											<div className="recipe-name">{recipe.name}</div>
											<div className="recipe-field">
												Category: {recipe.category}
											</div>
											<div className="recipe-field">
												Publish Date: {recipe.publishDate.toString()}
											</div>
										</div>
									);
								})}
							</div>
						) : null}
					</div>
				</div>
				{user ? <AddEditRecipeForm handleAddRecipe={handleAddRecipe} /> : null}
			</div>
		</div>
	);
}

export default App;
