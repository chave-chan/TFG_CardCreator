import React, { useState } from 'react';
import Button from './components/button/Button';
import TextInput from './components/textInput/TextInput';
import FileInput from './components/fileInput/FileInput';
import ColorPicker from './components/colorPicker/ColorPicker';
import FontSelector from './components/fontSelector/FontSelector';

function App() {
  const [text, setText] = useState('');
  const [color, setColor] = useState('#000000');
  const [file, setFile] = useState(null);
  const [font, setFont] = useState('Arial');

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Component Test Page</h1>

      {/* Text Input */}
      <TextInput 
        label="Text Input" 
        value={text} 
        onChange={setText} 
        placeholder="Enter some text" 
      />

      {/* Color Picker */}
      <ColorPicker 
        label="Color Picker" 
        value={color} 
        onChange={setColor} 
      />

      {/* File Input */}
      <FileInput 
        onChange={setFile} 
      />

      {/* Font Selector */}
      <FontSelector 
        label="Font Selector" 
        options={['Arial', 'Courier New', 'Times New Roman']} 
        value={font} 
        onChange={setFont} 
      />

      {/* Button */}
      <Button 
        label="Test Button" 
        onClick={() => alert('Button clicked!')} 
      />
    </div>
  );
}

export default App;