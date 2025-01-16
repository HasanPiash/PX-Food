const mealContainer=document.getElementById('mealContainer');
const modal=document.getElementById('modal');
const modalOverlay=document.getElementById('modal-overlay');
const modalContent=document.getElementById('modal-content');

const fetchMealDetails=async(mealId)=>{
  const url=`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
  try{
    const response=await fetch(url);
    if(!response.ok){
      throw new Error(`API Error: ${response.status}`);
    }
    const data=await response.json();
    return data.meals[0];
  } catch(error){
    console.error('Fetch Error:',error);
    return null;
  }
};


const fetchMeals=async(query='')=>{
  const url=query
    ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    : `https://www.themealdb.com/api/json/v1/1/filter.php?c=Fast Food`;
  try{
    const response= await fetch(url);
    if(!response.ok){
      throw new Error(`API Error: ${response.status}`);
    }
    const data= await response.json();
    return data.meals || [];
  }catch(error){
    console.error('Fetch Error:',error);
    return [];
  }
};


const renderMeals=async(meals)=>{
  mealContainer.innerHTML='';
  if (meals.length===0){
    mealContainer.innerHTML = '<p>No meals found here.</p>';
    return;
  }

  meals.forEach((meal)=>{
    const mealCard=document.createElement('div');
    mealCard.className='meal';
    mealCard.innerHTML=`
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <strong>${meal.strMeal}</strong>
    `;

    mealCard.addEventListener('click',()=>showDetails(meal.idMeal));
    mealContainer.appendChild(mealCard);
  });
};


const showDetails=async(mealId)=>{
  const meal= await fetchMealDetails(mealId);
  if(!meal) return;


  const ingredients=[];
  for(let i=1; i<=20; i++){
    const ingredient= meal[`strIngredient${i}`];
    const measure= meal[`strMeasure${i}`];
    if(ingredient && ingredient.trim()!==''){
      ingredients.push(`${measure? measure:''} ${ingredient}`.trim());
    }
  }

  modalContent.innerHTML=`
    <h3>${meal.strMeal}</h3>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:100%; max-width:200px; margin:10px 0;">
    <p><strong>Category :</strong> ${meal.strCategory || 'N/A'}</p>
    <p><strong>Ingredients :</strong></p>
    <ul>
      ${ingredients.map(ingredient=>`<li>${ingredient}</li>`).join('')}
    </ul>
  `;

  modal.style.display='block';
  modalOverlay.style.display='block';
};


const closeModal=()=>{
  modal.style.display='none';
  modalOverlay.style.display='none';
};


document.getElementById('searchBtn').addEventListener('click',async()=>{
  const query= document.getElementById('searchBar').value;
  const meals= await fetchMeals(query);
  renderMeals(meals);
});


window.addEventListener('load',async()=>{
  const meals= await fetchMeals();
  renderMeals(meals);
});