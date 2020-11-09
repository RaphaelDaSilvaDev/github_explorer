import React, {useEffect, useState} from 'react';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi';

import githubLogo from '../../assets/github-logo.svg';
import api from '../../services/api';

import { Header, RepositoryInfo, Issues, Footer } from './styles';

interface RepositoryParams{
  repository: string;
}

interface Repository{
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner:{
    login: string;
    avatar_url: string;
  }
}

interface Issue{
  id: number;
  title: string;
  html_url: string;
  user:{
    login: string;
  }
}

interface idRepository{
  id: number;
  full_name: string;
}

const Repository: React.FC = () =>{
  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  
  const { params } = useRouteMatch<RepositoryParams>();
  const history = useHistory();

  useEffect(() => {
    api.get(`repos/${params.repository}`).then((response) => {
      setRepository(response.data);
    });
    
    api.get(`repos/${params.repository}/issues`).then((response) => {
      setIssues(response.data);
    });
  },[params.repository]);

  function deleteRepositoryLocalStorage(){
    const storageRepositories = localStorage.getItem('@GithubExplorer:repositories');

    if(storageRepositories){
      const repositories:idRepository[] = JSON.parse(storageRepositories);
      const results = repositories.findIndex(name => name.full_name == params.repository);
      repositories.splice(results, 1);
      localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
      history.push('/')
    }else{
      return [];
    }
  }

  return (
    <>
    <Header>
      <img src={githubLogo} alt="Github Explorer"/>
      <Link to="/">
        <FiChevronLeft size={16}/>
        Voltar
      </Link>
    </Header>

   {repository && (
      <RepositoryInfo>
      <header>
        <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
        <div>
          <strong>{repository.full_name}</strong>
          <p>{repository.description}</p>
        </div>
        <button onClick={deleteRepositoryLocalStorage}><FiTrash2 size={26}/></button>
      </header>
      <ul>
        <li>
          <strong>{repository.stargazers_count}</strong>
          <span>Stars</span>
        </li>
        <li>
          <strong>{repository.forks_count}</strong>
          <span>Forks</span>
        </li>
        <li>
          <strong>{repository.open_issues_count}</strong>
          <span>Issues abertas</span>
        </li> 
      </ul>
    </RepositoryInfo>
   )}

  <Issues>  
    {issues.map(response => (
      <a key={response.id} href={response.html_url} target="_blank" >
        <div>
          <strong>{response.title}</strong>
          <p>{response.user.login}</p>
        </div>
        <FiChevronRight size={20} />
      </a>
    ))}
  </Issues>

  <Footer>
      <span>Criado no GoStack/RocketSeat por Raphael Silva 🚀</span>
  </Footer>
  </>
  );
}

export default Repository;