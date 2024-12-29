import React, { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { AppBar, Box, Toolbar, Typography, InputBase, Card, CardContent, CardMedia, Button, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha('#ffa', 0.15),
  '&:hover': {
    backgroundColor: alpha('#ffb', 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const RecipeCard = ({ recipe }) => {
  return (
    <Card className='card' sx={{
      maxWidth: 350,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <CardMedia
        component="img"
        height="200"
        image={recipe.strMealThumb}
        alt="Recipe Image"
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ padding: 2, }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{recipe.strMeal}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
          {recipe.strInstructions.slice(0, 100)}...
        </Typography>
      </CardContent>
      <Button
        size="small"
        sx={{
          color: '#f64f00',
          '&:hover': {
            backgroundColor: '#fff6f2'
          },
          marginBottom: 1,
        }}
        href={recipe.strSource}
        target="_blank"
      >
        View Recipe
      </Button>

    </Card>
  );
};

const RecipeSearchbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setRecipes([]);
      return;
    }

    const fetchRecipes = async () => {
      setLoading(true);
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      const data = await response.json();
      setRecipes(data.meals || []);
      setLoading(false);
    };

    fetchRecipes();
  }, [searchTerm]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#f75a2f' }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, fontWeight: 'bold' }}
          >
            Recipe Finder
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: '#fff' }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Search>
        </Toolbar>
      </AppBar>

      {/* Display results */}
      <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: 5 }}>
        {loading ? (
          <Typography variant="h6" color='#f75a2f'>Loading recipes...</Typography>
        ) : recipes.length === 0 ? (
          <Typography variant="h6" color='#f75a2f'>Search recipe.</Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {recipes.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} key={recipe.idMeal}>
                <RecipeCard recipe={recipe} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default RecipeSearchbar;