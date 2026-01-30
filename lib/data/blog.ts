/**
 * Data layer pour les articles de blog
 * Fonctions d'accès aux données des articles
 */

import { blogArticles } from '@/data/blog_articles';
import type { BlogArticle, ArticleCategory } from '@/lib/types';

// Liste des slugs d'articles pour vérification rapide
const articleSlugs = new Set(blogArticles.map(a => a.slug));

/**
 * Vérifie si un slug correspond à un article de blog
 */
export function isArticleSlug(slug: string): boolean {
  return articleSlugs.has(slug);
}

/**
 * Récupère tous les articles
 */
export function getAllArticles(): BlogArticle[] {
  return blogArticles;
}

/**
 * Récupère tous les slugs d'articles (pour generateStaticParams)
 */
export function getAllArticleSlugs(): string[] {
  return blogArticles.map(a => a.slug);
}

/**
 * Récupère un article par son slug
 */
export function getArticleBySlug(slug: string): BlogArticle | null {
  return blogArticles.find(a => a.slug === slug) || null;
}

/**
 * Récupère les articles d'une catégorie
 */
export function getArticlesByCategory(category: ArticleCategory): BlogArticle[] {
  return blogArticles.filter(a => a.category === category);
}

/**
 * Récupère les articles liés à un article donné
 */
export function getRelatedArticles(slug: string, limit: number = 3): BlogArticle[] {
  const article = getArticleBySlug(slug);
  if (!article) return [];

  return article.relatedSlugs
    .map(relatedSlug => getArticleBySlug(relatedSlug))
    .filter((a): a is BlogArticle => a !== null)
    .slice(0, limit);
}

/**
 * Récupère les articles par tag
 */
export function getArticlesByTag(tag: string): BlogArticle[] {
  return blogArticles.filter(a =>
    a.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Récupère les catégories avec leur nombre d'articles
 */
export function getCategories(): { category: ArticleCategory; count: number; label: string }[] {
  const categoryLabels: Record<ArticleCategory, string> = {
    pratiques: 'Pratiques',
    rencontres: 'Rencontres',
    conseils: 'Conseils',
    securite: 'Sécurité',
    couple: 'Couple'
  };

  const categoryCounts = blogArticles.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {} as Record<ArticleCategory, number>);

  return Object.entries(categoryCounts).map(([category, count]) => ({
    category: category as ArticleCategory,
    count,
    label: categoryLabels[category as ArticleCategory]
  }));
}
