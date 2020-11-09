import React, {FormEvent, useState, useEffect} from 'react';
import { FiChevronRight } from 'react-icons/fi';
import api from '../../services/api'

import githubLogo from '../../assets/github-logo.svg';

import {Title, Form, Repositories, Error, Footer} from './styles';
import { Link } from 'react-router-dom';
import { position } from 'polished';
import { relative } from 'path';

interface Repository{
  full_name: string;
  description: string;
  owner:{
    login: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () =>{
  const [inputError, setInputError] = useState('');
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
  const storageRepositories = localStorage.getItem('@GithubExplorer:repositories');

    if(storageRepositories){
      return JSON.parse(storageRepositories);
    }else{
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
  },[repositories])

  async function handleAddRepository(event: FormEvent<HTMLFormElement>){
    event.preventDefault();

    if(!newRepo){
      setInputError('Digite o autor/nome do repositório');
      return;
    }
    
    const repoExist = repositories.find(e => e.full_name === newRepo);
    if(repoExist){
      return setInputError('Repositório já na lista');
    }

    try{
      const response = await api.get(`repos/${newRepo}`);

      const repository = response.data;
        setRepositories([...repositories, repository]);
        setNewRepo('');
        setInputError('');
    }catch (err){
      setInputError('Falha na busca por esse repositório');
    }
  }

  return (
  <>
    <img src={githubLogo} alt="Github Explorer" />
    <Title>Explore Repositórios no Github</Title>

    <Form hasError={!!inputError} onSubmit={handleAddRepository}>
      <input value={newRepo} onChange={(e) => setNewRepo(e.target.value)} placeholder="Digite o nome do repositório"/>
      <button type="submit">Pesquisar</button>
    </Form>

    {inputError && <Error>{inputError}</Error>}

    <Repositories>
     {repositories.map(response => (
        <Link key={response.full_name} to={`/repositories/${response.full_name}`}>
        <img 
          src={response.owner.avatar_url}
          alt={response.owner.login}
        />
        <div>
          <strong>{response.full_name}</strong>
          <p>{response.description}</p>
        </div>
        <FiChevronRight size={20} />
      </Link>
     ))}
    </Repositories>

    <Footer>
      <span>Criado no GoStack/RocketSeat por Raphael Silva 🚀</span>
    </Footer>
  </>
  );
}

export default Dashboard;