import { useParams } from 'react-router-dom';

function MyMovie() {
  const { id } = useParams();

  // Tu peux ici faire une requête ou chercher le film dans une liste
  return (
    <div>
      <h1>Détail du film #{id}</h1>
      {/* Affiche ici le contenu détaillé */}
    </div>
  );
}

export default MyMovie;
