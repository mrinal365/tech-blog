export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'AI & Systems' | 'Frontend Architecture' | 'Backend & Infra' | 'DevOps & Cloud' | 'Performance';
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  featured?: boolean;
  views: number;
  likes: number;
}

export const SAMPLE_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'deep-dive-into-react-server-components-architecture',
    title: 'Deep Dive into React Server Components Architecture & Next.js 16 Optimizations',
    excerpt: 'Understanding the execution model, streaming SSR boundaries, zero-bundle-size components, and how compiler directives transform hydration in modern web apps.',
    category: 'Frontend Architecture',
    readTime: '8 min read',
    publishedAt: 'Sep 24, 2026',
    author: {
      name: 'Alex Rivera',
      role: 'Principal Frontend Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['React 19', 'Next.js 16', 'RSC', 'Web Performance'],
    featured: true,
    views: 4250,
    likes: 382,
    content: `
# Deep Dive into React Server Components Architecture

React Server Components (RSC) represent a fundamental paradigm shift in how we build React applications. Rather than shipping JavaScript to the browser to build DOM nodes on the client, RSC allows server-rendered components to output a JSON-like stream of serialized React elements directly to the client runtime.

## The Mental Model Shift

Traditional SSR rendered HTML on the server and hydrated it on the client with full component JavaScript bundles. Server Components operate differently:

\`\`\`tsx
// This component code NEVER gets shipped to the client browser!
import db from '@/lib/database';

export async function ArticleFeed() {
  const articles = await db.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT 10');
  
  return (
    <div className="space-y-4">
      {articles.map((post) => (
        <article key={post.id} className="p-4 border rounded-lg hover:shadow-lg transition">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="text-gray-600">{post.summary}</p>
        </article>
      ))}
    </div>
  );
}
\`\`\`

### Key Benefits of RSC:
1. **Zero Client-Side Bundle Impact**: Heavy dependencies like \`marked\`, \`highlight.js\`, or \`date-fns\` used strictly inside Server Components are omitted from the client bundle.
2. **Direct Backend Access**: Access databases, microservices, filesystem, and internal caches directly without exposing public API endpoints.
3. **Automatic Code Splitting**: Client components imported by Server Components are automatically split and loaded dynamically when required.

## Streaming SSR with Suspense

Next.js 16 uses React 19's enhanced streaming engine to stream HTML chunks as soon as they are ready:

\`\`\`tsx
import { Suspense } from 'react';
import { SlowMetricWidget, FastHeader } from '@/components';

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6">
      <FastHeader />
      <Suspense fallback={<div className="animate-pulse bg-gray-800 h-48 rounded-xl" />}>
        <SlowMetricWidget />
      </Suspense>
    </div>
  );
}
\`\`\`

By strategically placing Suspense boundaries, slow asynchronous data fetching does not block initial page rendering, resulting in drastically lower First Contentful Paint (FCP) and Time to Interactive (TTI).
    `,
  },
  {
    id: 'post-2',
    slug: 'building-resilient-rag-pipelines-with-vector-databases-and-llms',
    title: 'Building Resilient RAG Pipelines with Vector Databases & Hybrid Search',
    excerpt: 'A practical guide to combining dense vector embeddings with sparse BM25 keyword search for robust retrieval-augmented generation in LLM applications.',
    category: 'AI & Systems',
    readTime: '12 min read',
    publishedAt: 'Sep 20, 2026',
    author: {
      name: 'Elena Rostova',
      role: 'AI Infrastructure Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['RAG', 'Vector DB', 'LLM', 'Python', 'Embeddings'],
    featured: false,
    views: 3120,
    likes: 295,
    content: `
# Building Resilient RAG Pipelines with Hybrid Search

Retrieval-Augmented Generation (RAG) is the standard pattern for enriching Large Language Model prompts with private context. However, naive semantic search often fails on exact keyword queries, part numbers, or unique code symbols.

## Why Dense Embeddings Alone Fail

Dense embedding models (e.g., OpenAI \`text-embedding-3-large\`) project text into continuous vector spaces. While excellent for conceptual similarity, they struggle with exact matching:

- Query: \`"Error 0x80070005 access denied"\`
- Dense Vector Match: Articles talking about Windows file permissions generally, but missing the exact error code troubleshooting steps.

## The Hybrid Search Solution

Hybrid search combines **Dense Vector Search** with **Sparse Lexical Search (BM25)** using Reciprocal Rank Fusion (RRF).

\`\`\`python
def reciprocal_rank_fusion(dense_results, sparse_results, k=60):
    scores = {}
    for rank, doc in enumerate(dense_results):
        scores[doc.id] = scores.get(doc.id, 0) + 1 / (k + rank + 1)
    for rank, doc in enumerate(sparse_results):
        scores[doc.id] = scores.get(doc.id, 0) + 1 / (k + rank + 1)
    
    sorted_docs = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return sorted_docs
\`\`\`

### Architecture Steps:
1. **Chunking Strategy**: Use semantic chunking with overlapping windows (500 tokens, 100 token overlap).
2. **Dual Indexing**: Index chunks into a vector database (pgvector, Qdrant) and full-text search engine (Elasticsearch, Meilisearch).
3. **Re-Ranking Stage**: Apply a Cohere or BGE Cross-Encoder re-ranker to top 20 candidate documents to filter noise before feeding context into the LLM prompt window.
    `,
  },
  {
    id: 'post-3',
    slug: 'high-throughput-event-streaming-rust-tokio',
    title: 'High-Throughput Event Streaming Engines Built with Rust & Tokio',
    excerpt: 'Architecting lock-free ring buffers, zero-copy socket parsing, and asynchronous actor pools to process millions of messages per second on a single machine.',
    category: 'Backend & Infra',
    readTime: '10 min read',
    publishedAt: 'Sep 15, 2026',
    author: {
      name: 'Devon Vance',
      role: 'Systems Engineer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['Rust', 'Tokio', 'Concurrency', 'Systems', 'Performance'],
    featured: false,
    views: 5840,
    likes: 512,
    content: `
# High-Throughput Event Streaming Engines in Rust

When building microsecond-latency event streaming systems, traditional garbage-collected runtimes like Java or Node.js present unpredictable latency spikes due to GC pauses. Rust provides memory safety with zero-cost abstractions, making it ideal for event ingestion engines.

## Lock-Free Architecture with Channels

Instead of sharing mutable state using mutexes, Tokio actors communicate via lock-free MPMC (Multi-Producer Multi-Consumer) channels:

\`\`\`rust
use tokio::sync::mptc;
use std::sync::Arc;

struct EventMessage {
    payload_id: u64,
    timestamp_ns: u64,
    data: Vec<u8>,
}

#[tokio::main]
async fn main() {
    let (tx, mut rx) = tokio::sync::mpsc::channel::<EventMessage>(100_000);

    // Spawn async ingestion workers
    for worker_id in 0..8 {
        let worker_tx = tx.clone();
        tokio::spawn(async move {
            loop {
                let event = fetch_network_packet().await;
                if worker_tx.send(event).await.is_err() {
                    break;
                }
            }
        });
    }

    // Single-threaded state machine consumer
    while let Some(msg) = rx.recv().await {
        process_event(msg);
    }
}
\`\`\`

## Zero-Copy Socket Parsing with \`bytes\`

Memory allocations inside the hot event loop slow down throughput. By leveraging the \`bytes\` crate, reference-counted atomic buffers allow slice parsing without copying payload bytes across buffer boundaries.
    `,
  },
  {
    id: 'post-4',
    slug: 'zero-downtime-kubernetes-deployments-canary-istio',
    title: 'Zero-Downtime Kubernetes Deployments with Istio Service Mesh & Flagger',
    excerpt: 'Automating automated canary releases, traffic splitting, Prometheus metric analysis, and instant rollbacks for high-availability enterprise services.',
    category: 'DevOps & Cloud',
    readTime: '7 min read',
    publishedAt: 'Sep 10, 2026',
    author: {
      name: 'Sarah Chen',
      role: 'DevOps Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['Kubernetes', 'DevOps', 'Istio', 'Cloud Native'],
    featured: false,
    views: 2900,
    likes: 210,
    content: `
# Automated Canary Rollouts with Istio & Flagger

Continuous deployment without automated progressive delivery carries significant risk. A single undetected runtime bug can take down production for all users simultaneously.

## Progressive Traffic Splitting

Canary deployments gradually shift real user traffic from the baseline release to the new release while monitoring error rates and latency metrics.

### Canary Manifest Example:
\`\`\`yaml
apiVersion: flagger.app/v1beta1
kind: Canary
metadata:
  name: api-service
  namespace: production
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-service
  service:
    port: 8080
  analysis:
    interval: 1m
    threshold: 5
    maxWeight: 50
    stepWeight: 10
    metrics:
      - name: request-success-rate
        thresholdRange:
          min: 99
        interval: 1m
      - name: request-duration
        thresholdRange:
          max: 500
        interval: 1m
\`\`\`

If Prometheus reports HTTP error rates exceeding 1% or latency going above 500ms during the analysis phase, Flagger automatically halts traffic shift and reverts Istio VirtualServices back to 100% baseline traffic in under 5 seconds.
    `,
  }
];
