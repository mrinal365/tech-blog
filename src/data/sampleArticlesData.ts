import type { ArticleDocument } from "@/types/article";

export const DETAILED_SAMPLE_ARTICLES: ArticleDocument[] = [
  // ARTICLE 1: ANDAMAN ARCHIPELAGO DEEP GUIDE
  {
    schemaVersion: "1.0",
    article: {
      id: "art_andaman_deep_guide",
      slug: "andaman-islands-comprehensive-travel-and-infrastructure-guide",
      title: "The Comprehensive Andaman & Nicobar Archipelago Guide: Ecosystems, Logistics, & Marine Conservation",
      subtitle: "An exhaustive technical and travel breakdown of the Andaman Islands — from subsea fiber optic networks and endemic biodiversity to island hopping strategies.",
      author: {
        id: "user_andaman_exp",
        name: "Dr. Vikram Sethi",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "Marine Biologist & Systems Architect",
      },
      category: "Architecture",
      tags: ["Andaman", "Eco-Travel", "Subsea Fiber", "Marine Conservation", "Island Logistics"],
      status: "published",
      createdAt: "2026-09-27T00:00:00.000Z",
      updatedAt: "2026-09-27T00:00:00.000Z",
      seo: {
        metaTitle: "Comprehensive Andaman Travel & Infrastructure Guide 2026",
        metaDescription: "Exhaustive guide to the Andaman & Nicobar Islands covering Port Blair, Havelock, Neil Island, subsea fiber optic networks, and coral reef conservation.",
        primaryKeyword: "Andaman Islands Guide",
        secondaryKeywords: ["Havelock Island Radhanagar", "Port Blair Cellular Jail", "Andaman Subsea Cable", "Scuba Diving Swaraj Dweep"],
        canonicalUrl: "https://devarticle.com/articles/andaman-islands-comprehensive-travel-and-infrastructure-guide",
        ogTitle: "Andaman & Nicobar Islands: Exhaustive Travel & Ecological Breakdown",
        ogDescription: "From 2,300km of subsea optical fiber to untouched coral reefs of Swaraj Dweep.",
        ogImage: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200&auto=format&fit=crop&q=80",
        twitterTitle: "Andaman Archipelago: Deep Travel & Technical Analysis",
        twitterDescription: "Complete logistics, geography, underwater biodiversity, and connectivity specs.",
        noIndex: false,
        noFollow: false,
        structuredData: `{"@context":"https://schema.org","@type":"Article","headline":"The Comprehensive Andaman & Nicobar Archipelago Guide"}`,
      },
      aiSeo: {
        primaryTopic: "Andaman and Nicobar Islands Tourism & Ecology",
        searchIntent: "Informational & Logistics Planning",
        entities: ["Port Blair", "Swaraj Dweep (Havelock)", "Shaheed Dweep (Neil)", "CANI Subsea Cable", "Radhanagar Beach"],
        relatedConcepts: ["Bioluminescent Plankton", "Ferry Logistics", "Makruzz", "Barren Island Volcano", "Jarawa Reserve"],
        questionsAnswered: [
          "How do you travel between Port Blair, Havelock, and Neil Island?",
          "What is the CANI subsea cable project connecting Andaman to Chennai?",
          "What are the best diving spots in Swaraj Dweep?",
          "What permits are required for foreign and Indian tourists?"
        ],
        contentGaps: ["Detailed ferry schedule analysis", "Subsea cable latency metrics"],
        suggestedSchema: ["Article", "TouristAttraction", "FAQPage"],
        topicCoverage: 98,
      },
      metadata: {
        title: "The Comprehensive Andaman Archipelago Guide",
        slug: "andaman-islands-comprehensive-travel-and-infrastructure-guide",
        description: "Exhaustive travel, ecosystem, and connectivity analysis of the Andaman Archipelago.",
        author: { id: "user_andaman_exp", name: "Dr. Vikram Sethi" },
        category: "Architecture",
        tags: ["Andaman", "Eco-Travel", "Subsea Cable", "Marine Biology"],
        createdAt: "2026-09-27T00:00:00.000Z",
        readingTime: 15,
        difficulty: "intermediate",
        technologies: ["Subsea Fiber", "Marine Telemetry", "Logistics"],
      },
      settings: {
        readingTime: 15,
        allowComments: true,
        showTableOfContents: true,
        showAuthorBio: true,
      },
      blocks: [
        {
          id: "and_b1",
          type: "heading",
          version: 1,
          data: { level: 2, text: "1. Introduction to the Andaman & Nicobar Archipelago" },
          metadata: { anchor: "introduction" },
        },
        {
          id: "and_b2",
          type: "paragraph",
          version: 1,
          data: {
            text: "Situated at the junction of the Bay of Bengal and the Andaman Sea, the Andaman and Nicobar Islands comprise an archipelago of 572 tropical islands, islets, and rocks stretching over 800 kilometers. Renowned for pristine turquoise waters, untouched mangroves, and ancient indigenous tribal heritage, the region represents one of the world's most delicate bio-diverse ecological zones."
          },
        },
        {
          id: "and_b3",
          type: "callout",
          version: 1,
          data: {
            variant: "info",
            title: "Geography & Administrative Division",
            text: "The 10-Degree Channel (150km wide) physically separates the Andaman group to the north from the Nicobar group to the south. Port Blair serves as the administrative capital and main arrival entry point via Veer Savarkar International Airport (IXZ)."
          },
        },
        {
          id: "and_b4",
          type: "heading",
          version: 1,
          data: { level: 2, text: "2. Key Destinations & Island Hopping Hierarchy" },
        },
        {
          id: "and_b5",
          type: "comparison",
          version: 1,
          data: {
            headers: ["Island Name", "Primary Highlight", "Key Activities", "Travel Time from Port Blair"],
            rows: [
              ["Port Blair", "Cellular Jail, Ross Island, Chidiya Tapu", "Historical Tours, Sunset Viewpoints", "0 mins (Entry Hub)"],
              ["Swaraj Dweep (Havelock)", "Radhanagar Beach, Elephant Beach", "Scuba Diving, Snorkeling, Kayaking", "90 mins via High-Speed Catamaran"],
              ["Shaheed Dweep (Neil)", "Natural Bridge, Bharatpur Beach", "Glass-Bottom Boat Tours, Coral Exploration", "120 mins via Ferry"],
              ["Baratang Island", "Limestone Caves, Mud Volcanoes", "Mangrove Safari, Wildlife Observation", "3.5 hrs via Convoy Road"]
            ],
          },
        },
        {
          id: "and_b6",
          type: "heading",
          version: 1,
          data: { level: 2, text: "3. Digital Connectivity: The CANI Subsea Optical Fiber Cable" },
        },
        {
          id: "and_b7",
          type: "paragraph",
          version: 1,
          data: {
            text: "Prior to 2020, internet connectivity across the Andaman islands was reliant on limited satellite backhaul with high latency (500ms+) and bandwidth caps. The launch of the Chennai-Andaman & Nicobar Islands (CANI) Submarine Optical Fiber Cable fundamentally transformed the islands' digital infrastructure."
          },
        },
        {
          id: "and_b8",
          type: "benchmark",
          version: 1,
          data: {
            title: "CANI Subsea Cable Network Specifications",
            metrics: [
              { label: "Total Cable Length", value: "2,314", unit: "km" },
              { label: "Design Capacity", value: "400", unit: "Gbps" },
              { label: "Roundtrip Latency to Chennai", value: "11.8", unit: "ms" },
              { label: "Landing Stations", value: "8", unit: "Islands" }
            ],
          },
        },
        {
          id: "and_b8_react",
          type: "react-component",
          version: 1,
          data: {
            componentName: "CANISubseaTelemetryWidget",
            previewType: "telemetry",
            description: "Interactive Live Subsea Cable Fiber Telemetry & Node Latency Monitor",
          },
        },
        {
          id: "and_b9",
          type: "heading",
          version: 1,
          data: { level: 2, text: "4. Island Transport & Ferry Booking System" },
        },
        {
          id: "and_b10",
          type: "steps",
          version: 1,
          data: {
            steps: [
              {
                title: "Arrive at Port Blair Airport (IXZ)",
                description: "Pre-book airport taxis or government buses to Haddo Jetty or Phoenix Bay Jetty."
              },
              {
                title: "Board Private Catamaran (Makruzz / Nautika / Green Ocean)",
                description: "High-speed vessels operate daily routes between Port Blair, Havelock, and Neil Island with air-conditioned seating."
              },
              {
                title: "Local Island Commute",
                description: "Rent two-wheelers, auto-rickshaws, or pre-arranged cabs for beach and dive site access."
              }
            ],
          },
        },
        {
          id: "and_b11",
          type: "heading",
          version: 1,
          data: { level: 2, text: "5. Marine Conservation & Coral Ecosystem Protection" },
        },
        {
          id: "and_b12",
          type: "takeaways",
          version: 1,
          data: {
            items: [
              "Always use reef-safe physical mineral sunscreens to protect coral reefs from chemical bleaching.",
              "Never touch, stand on, or break living coral formations while snorkeling or scuba diving.",
              "Single-use plastic bottles are strictly prohibited on Havelock and Neil islands — carry reusable flasks.",
              "Respect tribal reserve boundaries (Jarawa Reserve Trunk Road) — photography or contact is strictly illegal."
            ],
          },
        },
      ],
    },
  },

  // ARTICLE 2: REACT SERVER COMPONENTS ARCHITECTURE
  {
    schemaVersion: "1.0",
    article: {
      id: "art_rsc_architecture_guide",
      slug: "deep-dive-into-react-server-components-architecture",
      title: "Deep Dive into React Server Components Architecture & Next.js 16 Optimizations",
      subtitle: "Understanding the execution model, streaming SSR boundaries, zero-bundle-size components, and compiler directives in modern web applications.",
      author: {
        id: "user_alex_rivera",
        name: "Alex Rivera",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        role: "Principal Frontend Architect",
      },
      category: "Frontend Architecture",
      tags: ["React 19", "Next.js 16", "RSC", "Web Performance", "TypeScript"],
      status: "published",
      createdAt: "2026-09-24T00:00:00.000Z",
      updatedAt: "2026-09-24T00:00:00.000Z",
      seo: {
        metaTitle: "React Server Components Architecture Guide 2026",
        metaDescription: "Exhaustive deep dive into React 19 RSC execution model, streaming SSR, zero-bundle components, and Next.js 16 compiler optimizations.",
        primaryKeyword: "React Server Components",
        secondaryKeywords: ["Next.js 16 RSC", "Streaming SSR", "React 19 Compiler", "Zero Bundle Size"],
        canonicalUrl: "https://devarticle.com/articles/deep-dive-into-react-server-components-architecture",
        ogTitle: "React Server Components: Mental Model & Execution Pipeline",
        ogDescription: "Learn how React 19 streams serialized UI payload directly from server runtimes.",
        ogImage: "",
        twitterTitle: "RSC & Next.js 16 Architecture Masterclass",
        twitterDescription: "Code examples, benchmarks, and architectural mental models.",
        noIndex: false,
        noFollow: false,
        structuredData: "",
      },
      aiSeo: {
        primaryTopic: "React Server Components (RSC) & Web Performance",
        searchIntent: "Technical Architecture & Code Patterns",
        entities: ["React 19", "Next.js 16", "RSC Wire Protocol", "Suspense Streaming"],
        relatedConcepts: ["Hydration", "Server Actions", "Zero-Bundle-Size", "Compiler Directives"],
        questionsAnswered: [
          "How do React Server Components eliminate client bundle overhead?",
          "What is the RSC serialization wire protocol format?",
          "How does Suspense streaming reduce First Contentful Paint?"
        ],
        contentGaps: ["Detailed memory profiling traces"],
        suggestedSchema: ["TechArticle"],
        topicCoverage: 96,
      },
      metadata: {
        title: "Deep Dive into React Server Components Architecture",
        slug: "deep-dive-into-react-server-components-architecture",
        description: "Technical guide on React 19 RSC, streaming SSR, and zero-bundle size architecture.",
        author: { id: "user_alex_rivera", name: "Alex Rivera" },
        category: "Frontend Architecture",
        tags: ["React 19", "Next.js 16", "RSC"],
        createdAt: "2026-09-24T00:00:00.000Z",
        readingTime: 10,
        difficulty: "expert",
        technologies: ["React 19", "Next.js 16", "TypeScript"],
      },
      settings: {
        readingTime: 10,
        allowComments: true,
        showTableOfContents: true,
        showAuthorBio: true,
      },
      blocks: [
        {
          id: "rsc_b1",
          type: "heading",
          version: 1,
          data: { level: 2, text: "The Paradigm Shift: From Hydration to Serialization" },
        },
        {
          id: "rsc_b2",
          type: "paragraph",
          version: 1,
          data: {
            text: "Traditional Server-Side Rendering (SSR) generated static HTML on the server, but still sent full JavaScript component code to the client to re-evaluate and hydrate the DOM tree. React Server Components fundamentally change this equation by running exclusively on the server node and streaming serialized JSON-like element trees directly to the browser."
          },
        },
        {
          id: "rsc_b3",
          type: "code",
          version: 1,
          data: {
            language: "tsx",
            filename: "app/feed/page.tsx",
            code: `// Server Component — Executed ONLY on the node runtime!
import db from '@/lib/db';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export default async function FeedPage() {
  const posts = await db.post.findMany({ take: 10 });

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      {posts.map((post) => (
        <article key={post.id} className="p-4 border rounded-xl bg-zinc-900">
          <h2 className="text-xl font-bold">{post.title}</h2>
          {/* Heavy markdown parser library executed strictly on server! */}
          <MarkdownRenderer content={post.rawMarkdown} />
        </article>
      ))}
    </main>
  );
}`
          },
        },
        {
          id: "rsc_b4",
          type: "benchmark",
          version: 1,
          data: {
            title: "RSC vs Traditional SSR Bundle Comparison",
            metrics: [
              { label: "Client JS Bundle Impact", value: "0", unit: "KB" },
              { label: "First Contentful Paint (FCP)", value: "240", unit: "ms" },
              { label: "Time to Interactive (TTI)", value: "310", unit: "ms" },
              { label: "Server Payload Compression", value: "4.2x", unit: "ratio" }
            ],
          },
        },
        {
          id: "rsc_b5_react",
          type: "react-component",
          version: 1,
          data: {
            componentName: "StatefulCounterDemo",
            previewType: "counter",
            description: "Interactive Client Component embedded inside Server-Rendered Parent Boundary",
          },
        },
      ],
    },
  },

  // ARTICLE 3: RAG PIPELINES WITH VECTOR DATABASES
  {
    schemaVersion: "1.0",
    article: {
      id: "art_rag_vector_pipeline",
      slug: "building-resilient-rag-pipelines-with-vector-databases-and-llms",
      title: "Building Resilient RAG Pipelines with Vector Databases & Hybrid Search",
      subtitle: "Combining dense vector embeddings with BM25 sparse keyword search and cross-encoder re-ranking for enterprise AI retrieval.",
      author: {
        id: "user_elena_r",
        name: "Elena Rostova",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        role: "AI Infrastructure Lead",
      },
      category: "AI & Systems",
      tags: ["RAG", "Vector DB", "LLM", "Python", "Embeddings", "pgvector"],
      status: "published",
      createdAt: "2026-09-20T00:00:00.000Z",
      updatedAt: "2026-09-20T00:00:00.000Z",
      seo: {
        metaTitle: "Resilient RAG Pipelines & Hybrid Search Guide 2026",
        metaDescription: "Step-by-step technical guide to building hybrid search RAG pipelines combining BM25 keyword matching with pgvector embeddings and cross-encoders.",
        primaryKeyword: "Hybrid Search RAG Pipeline",
        secondaryKeywords: ["Reciprocal Rank Fusion", "pgvector tutorial", "Cross-Encoder Reranking"],
        canonicalUrl: "https://devarticle.com/articles/building-resilient-rag-pipelines-with-vector-databases-and-llms",
        ogTitle: "Hybrid Search RAG Architectures for Enterprise LLMs",
        ogDescription: "Why vector search alone fails and how Reciprocal Rank Fusion solves accuracy gaps.",
        ogImage: "",
        twitterTitle: "Building Hybrid RAG Systems with Python & pgvector",
        twitterDescription: "Complete python code and mathematical formulas for RRF.",
        noIndex: false,
        noFollow: false,
        structuredData: "",
      },
      aiSeo: {
        primaryTopic: "Retrieval-Augmented Generation & Vector Indexing",
        searchIntent: "Engineering Architecture & Implementation",
        entities: ["Reciprocal Rank Fusion", "BM25", "pgvector", "Cohere Rerank"],
        relatedConcepts: ["Semantic Search", "Sparse Embeddings", "Dense Embeddings", "Context Compression"],
        questionsAnswered: [
          "Why do dense embeddings fail on exact keyword match queries?",
          "How does Reciprocal Rank Fusion (RRF) combine dense and sparse search rankings?",
          "What is the optimal chunk size and overlap for technical document indexing?"
        ],
        contentGaps: ["HNSW index parameter tuning details"],
        suggestedSchema: ["TechArticle"],
        topicCoverage: 94,
      },
      metadata: {
        title: "Building Resilient RAG Pipelines with Hybrid Search",
        slug: "building-resilient-rag-pipelines-with-vector-databases-and-llms",
        description: "Technical guide to hybrid RAG combining vector embeddings with BM25 keyword search.",
        author: { id: "user_elena_r", name: "Elena Rostova" },
        category: "AI & Systems",
        tags: ["RAG", "Vector DB", "LLM", "Python"],
        createdAt: "2026-09-20T00:00:00.000Z",
        readingTime: 12,
        difficulty: "advanced",
        technologies: ["Python", "pgvector", "Qdrant", "OpenAI"],
      },
      settings: {
        readingTime: 12,
        allowComments: true,
        showTableOfContents: true,
        showAuthorBio: true,
      },
      blocks: [
        {
          id: "rag_b1",
          type: "heading",
          version: 1,
          data: { level: 2, text: "Why Pure Vector Search Is Insufficient" },
        },
        {
          id: "rag_b2",
          type: "paragraph",
          version: 1,
          data: {
            text: "Dense vector embeddings (e.g., text-embedding-3-large) excel at conceptual semantic understanding, but struggle with exact keyword queries, product SKUs, code symbols, or error trace codes. Hybrid retrieval combines lexical BM25 search with dense vector distance scoring using Reciprocal Rank Fusion (RRF)."
          },
        },
        {
          id: "rag_b3",
          type: "code",
          version: 1,
          data: {
            language: "python",
            filename: "rag/retrieval.py",
            code: `def reciprocal_rank_fusion(dense_rankings, sparse_rankings, k=60):
    """
    Combines dense vector and BM25 sparse search results using RRF.
    """
    scores = {}

    for rank, doc in enumerate(dense_rankings):
        scores[doc.id] = scores.get(doc.id, 0) + 1 / (k + rank + 1)

    for rank, doc in enumerate(sparse_rankings):
        scores[doc.id] = scores.get(doc.id, 0) + 1 / (k + rank + 1)

    sorted_docs = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return sorted_docs`
          },
        },
        {
          id: "rag_b4_react",
          type: "react-component",
          version: 1,
          data: {
            componentName: "RAGLatencyEstimator",
            previewType: "rag-calculator",
            description: "Live Interactive Vector Retrieval & Hybrid RAG Latency Calculator",
          },
        },
      ],
    },
  },
];
