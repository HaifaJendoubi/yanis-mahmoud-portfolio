'use client'; // On dit à Next.js que c'est un composant client (car on fetch des données)

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // ajuste le chemin si besoin (src/lib → @/lib)

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;

        setProjects(data || []);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des projets');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Portfolio Yanis Mahmoud
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Projets</h2>

          {loading && <p className="text-center">Chargement des projets...</p>}

          {error && (
            <p className="text-red-600 text-center">Erreur : {error}</p>
          )}

          {!loading && !error && projects.length === 0 && (
            <p className="text-center text-gray-500">
              Aucun projet pour le moment. Ajoutez-en dans Supabase !
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-700 mb-4">{project.description}</p>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Voir le projet →
                  </a>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Statut : {project.status || 'Non défini'}
                </p>
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center text-gray-500 mt-12">
          <p>Connecté à Supabase – Étape 3 terminée !</p>
        </footer>
      </div>
    </main>
  );
}