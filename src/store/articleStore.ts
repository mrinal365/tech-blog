import { createSlice, PayloadAction, configureStore } from "@reduxjs/toolkit";
import {
  BaseBlock,
  ArticleDocument,
  ArticleMetadata,
  ArticleSEO,
  ArticleAISEO,
  ArticleSettings,
  ArticleStatus,
  EditorMode,
  SidebarTab,
} from "@/types/article";
import { createBlock } from "@/registry/blockRegistry";
import type { BlockType } from "@/types/article";

// Default Article
function createDefaultArticle(): ArticleDocument {
  const now = new Date().toISOString();
  return {
    schemaVersion: "1.0",
    article: {
      id: `article_${Date.now()}`,
      slug: "",
      title: "",
      subtitle: "",
      author: {
        id: "user_1",
        name: "Author",
        avatar: "",
        role: "Developer",
      },
      category: "Frontend",
      tags: [],
      cover: undefined,
      status: "draft" as ArticleStatus,
      blocks: [
        createBlock("seo-block", {
          primaryKeyword: "",
          targetIntent: "",
          entities: [],
          questionsAnswered: [],
          topicCoverage: 100,
          suggestedSchema: ["TechArticle"],
        })
      ],
      seo: {
        metaTitle: "",
        metaDescription: "",
        primaryKeyword: "",
        secondaryKeywords: [],
        canonicalUrl: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        twitterTitle: "",
        twitterDescription: "",
        noIndex: false,
        noFollow: false,
        structuredData: "",
      },
      aiSeo: {
        primaryTopic: "",
        searchIntent: "",
        entities: [],
        relatedConcepts: [],
        questionsAnswered: [],
        contentGaps: [],
        suggestedSchema: [],
        topicCoverage: 0,
      },
      metadata: {
        title: "",
        slug: "",
        description: "",
        author: { id: "user_1", name: "Author" },
        category: "Frontend",
        tags: [],
        createdAt: now,
        readingTime: 0,
        difficulty: "intermediate",
        technologies: [],
      },
      settings: {
        readingTime: 0,
        allowComments: true,
        showTableOfContents: true,
        showAuthorBio: true,
      },
      createdAt: now,
      updatedAt: now,
    },
  };
}

// Editor State
interface EditorState {
  // Article document
  document: ArticleDocument;

  // Editor UI state
  selectedBlockId: string | null;
  mode: EditorMode;
  sidebarTab: SidebarTab;

  // Undo/redo
  past: ArticleDocument[];
  future: ArticleDocument[];
  maxHistory: number;

  // Autosave
  saveStatus: "idle" | "saving" | "saved" | "error";
  lastSavedAt: string | null;

  // Block library
  blockLibraryOpen: boolean;
  slashMenuOpen: boolean;
  slashMenuBlockIndex: number | null;
}

const initialState: EditorState = {
  document: createDefaultArticle(),
  selectedBlockId: null,
  mode: "edit",
  sidebarTab: "article",
  past: [],
  future: [],
  maxHistory: 50,
  saveStatus: "idle",
  lastSavedAt: null,
  blockLibraryOpen: false,
  slashMenuOpen: false,
  slashMenuBlockIndex: null,
};

// Helper: Push to history
function pushHistory(state: EditorState) {
  state.past.push(JSON.parse(JSON.stringify(state.document)));
  if (state.past.length > state.maxHistory) {
    state.past.shift();
  }
  state.future = [];
}

// Slice
const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    // Document
    loadArticle(state, action: PayloadAction<ArticleDocument>) {
      pushHistory(state);
      state.document = action.payload;
      state.selectedBlockId = null;
      state.document.article.updatedAt = new Date().toISOString();
    },

    resetEditor(state) {
      const fresh = createDefaultArticle();
      pushHistory(state);
      state.document = fresh;
      state.selectedBlockId = null;
    },

    // Article Fields
    setTitle(state, action: PayloadAction<string>) {
      pushHistory(state);
      state.document.article.title = action.payload;
      state.document.article.metadata.title = action.payload;
      state.document.article.updatedAt = new Date().toISOString();
    },

    setSubtitle(state, action: PayloadAction<string>) {
      pushHistory(state);
      state.document.article.subtitle = action.payload;
      state.document.article.updatedAt = new Date().toISOString();
    },

    setSlug(state, action: PayloadAction<string>) {
      state.document.article.slug = action.payload;
      state.document.article.metadata.slug = action.payload;
    },

    setCategory(state, action: PayloadAction<string>) {
      state.document.article.category = action.payload;
      state.document.article.metadata.category = action.payload;
    },

    setTags(state, action: PayloadAction<string[]>) {
      state.document.article.tags = action.payload;
      state.document.article.metadata.tags = action.payload;
    },

    setStatus(state, action: PayloadAction<ArticleStatus>) {
      state.document.article.status = action.payload;
      state.document.article.updatedAt = new Date().toISOString();
    },

    setMetadata(state, action: PayloadAction<Partial<ArticleMetadata>>) {
      state.document.article.metadata = {
        ...state.document.article.metadata,
        ...action.payload,
      };
    },

    setSettings(state, action: PayloadAction<Partial<ArticleSettings>>) {
      state.document.article.settings = {
        ...state.document.article.settings,
        ...action.payload,
      };
    },

    // SEO
    setSEO(state, action: PayloadAction<Partial<ArticleSEO>>) {
      state.document.article.seo = {
        ...state.document.article.seo,
        ...action.payload,
      };
    },

    setAISEO(state, action: PayloadAction<Partial<ArticleAISEO>>) {
      state.document.article.aiSeo = {
        ...state.document.article.aiSeo,
        ...action.payload,
      };
    },

    // Blocks
    addBlock(state, action: PayloadAction<{ type: BlockType; index?: number }>) {
      pushHistory(state);
      const newBlock = createBlock(action.payload.type);
      const idx = action.payload.index ?? state.document.article.blocks.length;
      state.document.article.blocks.splice(idx, 0, newBlock);
      state.selectedBlockId = newBlock.id;
      state.document.article.updatedAt = new Date().toISOString();
    },

    removeBlock(state, action: PayloadAction<string>) {
      pushHistory(state);
      state.document.article.blocks = state.document.article.blocks.filter(
        (b) => b.id !== action.payload
      );
      if (state.selectedBlockId === action.payload) {
        state.selectedBlockId = null;
      }
      state.document.article.updatedAt = new Date().toISOString();
    },

    updateBlockData(
      state,
      action: PayloadAction<{ blockId: string; data: Record<string, unknown> }>
    ) {
      pushHistory(state);
      const block = state.document.article.blocks.find(
        (b) => b.id === action.payload.blockId
      );
      if (block) {
        block.data = { ...block.data, ...action.payload.data };
        state.document.article.updatedAt = new Date().toISOString();
      }
    },

    updateBlockMetadata(
      state,
      action: PayloadAction<{
        blockId: string;
        metadata: Partial<BaseBlock["metadata"]>;
      }>
    ) {
      const block = state.document.article.blocks.find(
        (b) => b.id === action.payload.blockId
      );
      if (block) {
        block.metadata = { ...block.metadata, ...action.payload.metadata };
      }
    },

    updateBlockSEO(
      state,
      action: PayloadAction<{
        blockId: string;
        seo: Partial<BaseBlock["seo"]>;
      }>
    ) {
      const block = state.document.article.blocks.find(
        (b) => b.id === action.payload.blockId
      );
      if (block) {
        block.seo = { ...block.seo, ...action.payload.seo };
      }
    },

    moveBlock(
      state,
      action: PayloadAction<{ blockId: string; direction: "up" | "down" }>
    ) {
      pushHistory(state);
      const blocks = state.document.article.blocks;
      const idx = blocks.findIndex((b) => b.id === action.payload.blockId);
      if (idx === -1) return;

      const targetIdx =
        action.payload.direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= blocks.length) return;

      [blocks[idx], blocks[targetIdx]] = [blocks[targetIdx], blocks[idx]];
      state.document.article.updatedAt = new Date().toISOString();
    },

    duplicateBlock(state, action: PayloadAction<string>) {
      pushHistory(state);
      const idx = state.document.article.blocks.findIndex(
        (b) => b.id === action.payload
      );
      if (idx === -1) return;

      const original = state.document.article.blocks[idx];
      const duplicate: BaseBlock = {
        ...JSON.parse(JSON.stringify(original)),
        id: `blk_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      };
      state.document.article.blocks.splice(idx + 1, 0, duplicate);
      state.selectedBlockId = duplicate.id;
      state.document.article.updatedAt = new Date().toISOString();
    },

    // Editor UI
    selectBlock(state, action: PayloadAction<string | null>) {
      state.selectedBlockId = action.payload;
      if (action.payload) {
        state.sidebarTab = "article"; // Show block settings
      }
    },

    setMode(state, action: PayloadAction<EditorMode>) {
      state.mode = action.payload;
    },

    setSidebarTab(state, action: PayloadAction<SidebarTab>) {
      state.sidebarTab = action.payload;
    },

    toggleBlockLibrary(state) {
      state.blockLibraryOpen = !state.blockLibraryOpen;
    },

    setBlockLibraryOpen(state, action: PayloadAction<boolean>) {
      state.blockLibraryOpen = action.payload;
    },

    openSlashMenu(state, action: PayloadAction<number>) {
      state.slashMenuOpen = true;
      state.slashMenuBlockIndex = action.payload;
    },

    closeSlashMenu(state) {
      state.slashMenuOpen = false;
      state.slashMenuBlockIndex = null;
    },

    // Undo / Redo
    undo(state) {
      if (state.past.length === 0) return;
      const previous = state.past.pop()!;
      state.future.push(JSON.parse(JSON.stringify(state.document)));
      state.document = previous;
    },

    redo(state) {
      if (state.future.length === 0) return;
      const next = state.future.pop()!;
      state.past.push(JSON.parse(JSON.stringify(state.document)));
      state.document = next;
    },

    // Save Status
    setSaveStatus(
      state,
      action: PayloadAction<"idle" | "saving" | "saved" | "error">
    ) {
      state.saveStatus = action.payload;
      if (action.payload === "saved") {
        state.lastSavedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  loadArticle,
  resetEditor,
  setTitle,
  setSubtitle,
  setSlug,
  setCategory,
  setTags,
  setStatus,
  setMetadata,
  setSettings,
  setSEO,
  setAISEO,
  addBlock,
  removeBlock,
  updateBlockData,
  updateBlockMetadata,
  updateBlockSEO,
  moveBlock,
  duplicateBlock,
  selectBlock,
  setMode,
  setSidebarTab,
  toggleBlockLibrary,
  setBlockLibraryOpen,
  openSlashMenu,
  closeSlashMenu,
  undo,
  redo,
  setSaveStatus,
} = editorSlice.actions;

// Store
export const store = configureStore({
  reducer: {
    editor: editorSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
