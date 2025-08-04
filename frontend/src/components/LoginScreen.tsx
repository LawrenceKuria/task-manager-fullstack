import React, { useState } from "react";
import { Button, Input, Spacer, Card } from "@nextui-org/react";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <Card className="mb-4 p-4">{error}</Card>}
      <form onSubmit={handleSubmit}>
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Spacer y={1} />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Spacer y={1} />
        <Button type="submit" color="primary">
          Login
        </Button>
      </form>
      <Spacer y={1} />
      <Button variant="light" onClick={() => navigate("/register")}>Register</Button>
    </div>
  );
};

export default LoginScreen;
