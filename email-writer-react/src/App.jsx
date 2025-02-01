import { useState } from 'react'
import { Box, Button, FormControl, Input, InputLabel, MenuItem, TextField,Select, CircularProgress } from '@mui/material'
import './App.css'
import { Container, Typography } from '@mui/material'
import axios from 'axios'

function App() {
  const [tone, settone] = useState('')
  const [emailContent, setEmailContent] = useState('')
  const[loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const[generatedEmail, setGeneratedEmail] = useState(null);
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setGeneratedEmail(null);
    try {
      const response = await axios.post('http://localhost:8080/api/email/generate', {
       emailContent,tone 
      });
      setGeneratedEmail(response.data);
    } catch (error) {
      setError("Something went wrong");
      console.error(error);
    }
    setLoading(false);

  };

  return (
    <Container maxWidth="md" sx={{py: 4}}>
      <Typography variant='h3' component={'h1'} align='center' gutterBottom>
        Email Generator
      </Typography>
      <Box sx={{mx: 2}}>
        
        <TextField
          label="Email Content"
          variant="outlined"
          multiline
          rows={10}
          fullWidth
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{mb: 2}}
        /> 
    
      <FormControl  fullWidth sx={{mb: 2}}>
          <InputLabel>Tone(optional)</InputLabel>
          <Select value={tone}  label={"Tone"} onChange={(e) => settone(e.target.value)}>
            <MenuItem value=''>None</MenuItem>
            <MenuItem value='professional'>Professional</MenuItem>
            <MenuItem value='Casual'>Casual</MenuItem>
            <MenuItem value='Friendly'>Friendly</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={loading||!emailContent}
          >{loading? <CircularProgress size={24} />:"GeneratedEmail"}</Button>
        </Box>
        {error && <Typography color='error' align='center'>{"error"}</Typography>}
        {generatedEmail && <Box sx={{mt: 3}}>
          <Typography variant='h6' gutterBottom>
            Generated Email
          </Typography>
          <TextField
            variant="outlined"
            multiline
            rows={10}
            fullWidth
            value={generatedEmail}
            inputProps={{readOnly: true}}
            sx={{mb: 2}}
          />
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => {
              navigator.clipboard.writeText(generatedEmail)
            }}> Copy to Clipboard
          </Button>
        </Box>
        }
    </Container>
  )
}

export default App
