import { useEffect, useState } from "react";

function AddEditRecipeForm({
	handleAddRecipe,
	existingRecipe,
	handleUpdateRecipe,
	handleEditRecipeCancel,
}) {
	const [name, setName] = useState("");
	const [category, setCategory] = useState("");
	const [publishDate, setPublishDate] = useState(
		new Date().toISOString().split("T")[0]
	);
	const [directions, setDirections] = useState("");
	const [ingredients, setIngredients] = useState([]);
	const [ingredientName, setIngredientName] = useState("");

	useEffect(() => {
		if (existingRecipe) {
			setName(existingRecipe.name);
			setCategory(existingRecipe.category);
			setDirections(existingRecipe.directions);
			setPublishDate(existingRecipe.publishDate.toISOString().split("T")[0]);
			setIngredients(existingRecipe.ingredients);
		} else {
			resetForm();
		}
	}, [existingRecipe]);

	function handleAddIngredient(e) {
		if (e.key && e.key !== "Enter") {
			return;
		}

		e.preventDefault();
		if (!ingredientName) {
			alert("Please enter an ingredient name");
			return;
		}

		setIngredients([...ingredients, ingredientName]);
		setIngredientName("");
	}

	function handleRecipeFormSubmit(e) {
		e.preventDefault();

		if (ingredients.length === 0) {
			alert("Ingredient can't be empty");
			return;
		}

		const isPublished = new Date(publishDate) <= new Date() ? true : false;
		const newRecipe = {
			name,
			category,
			directions,
			publishDate: new Date(publishDate),
			isPublished,
			ingredients,
		};

		if (existingRecipe) {
			handleUpdateRecipe(newRecipe, existingRecipe.id);
		} else {
			handleAddRecipe(newRecipe);
		}
		resetForm();
	}

	function resetForm() {
		setName("");
		setCategory("");
		setDirections("");
		setPublishDate("");
		setIngredients([]);
	}

	return (
		<form
			className="add-edit-recipe-form-container"
			onSubmit={handleRecipeFormSubmit}
		>
			{existingRecipe ? <h2>Update Recipe</h2> : <h2>Add a New Recipe</h2>}
			<div className="top-form-section">
				<div className="fields">
					<label className="recipe-label input-label">
						Recipe Name:
						<input
							type="text"
							className="input-text"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</label>

					<label className="recipe-label input-label">
						Category:
						<select
							className="select"
							required
							value={category}
							onChange={(e) => setCategory(e.target.value)}
						>
							<option value=""></option>
							<option value="breadsSandwichesAndPizza">
								Breads, Sandwiches, and Pizza
							</option>
							<option value="eggsAndBreakfast">Eggs & Breakfast</option>
							<option value="dessertsAndBakedGoods">
								Desserts & Baked Goods
							</option>
							<option value="fishAndSeafood">Fish & Seafood</option>
							<option value="vegetables">Vegetables</option>
						</select>
					</label>
					<label className="recipe-label input-label">
						Directions:
						<textarea
							required
							value={directions}
							onChange={(e) => setDirections(e.target.value)}
							className="input-text directions"
						></textarea>
					</label>
					<label className="recipe-label input-label">
						Publish Date:
						<input
							type="date"
							required
							className="input-text"
							value={publishDate}
							onChange={(e) => setPublishDate(e.target.value)}
						/>
					</label>
				</div>
			</div>
			<div className="ingredients-list">
				<h3 className="text-center">Ingredients</h3>
				<table className="ingredients-table">
					<thead>
						<tr>
							<th className="table-header">Ingredient</th>
							<th className="table-header">Delete</th>
						</tr>
					</thead>
					<tbody>
						{ingredients && ingredients.length > 0
							? ingredients.map((ingredient) => {
									return (
										<tr key={ingredient}>
											<td className="table-data text-center">{ingredient}</td>
											<td className="ingredient-delete-box">
												<button
													type="button"
													className="secondary-button ingredient-delete-button"
												>
													Delete
												</button>
											</td>
										</tr>
									);
							  })
							: null}
					</tbody>
				</table>
				{ingredients && ingredients.length === 0 ? (
					<h3 className="text-center no-ingredients">
						No ingredients added yet
					</h3>
				) : null}
				<div className="ingredient-form">
					<label className="ingredient-label">
						Ingredient:
						<input
							type="text"
							className="input-text"
							placeholder="ex. 1 cup of sugar"
							value={ingredientName}
							onChange={(e) => setIngredientName(e.target.value)}
							onKeyDown={handleAddIngredient}
						/>
					</label>
					<button
						type="button"
						className="primary-button add-ingredient-button"
						onClick={handleAddIngredient}
					>
						Add Ingredient
					</button>
				</div>
			</div>
			<div className="action-buttons">
				<button className="primary-button action-button">
					{existingRecipe ? "Update Recipe" : "Create Recipe"}
				</button>
				{existingRecipe ? (
					<>
						<button
							type="button"
							className="primary-button action-button"
							onClick={handleEditRecipeCancel}
						></button>
					</>
				) : null}
			</div>
		</form>
	);
}

export default AddEditRecipeForm;
