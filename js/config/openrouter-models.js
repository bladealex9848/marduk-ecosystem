/**
 * MARDUK ECOSYSTEM - CONFIGURACIÓN DE MODELOS DE OPENROUTER
 *
 * Este archivo contiene la configuración de los modelos disponibles en OpenRouter
 * para su uso en la aplicación.
 */

const OPENROUTER_MODELS_CONFIG = {
  fast_models: "google/gemini-2.0-flash-thinking-exp:free",
  default_model: "meta-llama/llama-4-scout:free",
  models: [ 
    {
      id: "meta-llama/llama-4-maverick:free",
      name: "Llama 4 Maverick",
      provider: "Meta",
      specialty: "multimodal",
      capabilities: [
        "vision_understanding",
        "advanced_reasoning",
        "multi_task",
        "multilingual_support",
        "moe_architecture",
        "large_context",
        "code_generation",
        "image_reasoning"
      ],
      prompt_types: ["general", "scientific", "multimodal", "visual", "analytical", "coding"]
    },
    {
      id: "meta-llama/llama-4-scout:free",
      name: "Llama 4 Scout",
      provider: "Meta",
      specialty: "multimodal",
      capabilities: [
        "vision_understanding",
        "advanced_reasoning",
        "multi_task",
        "multilingual_support",
        "moe_architecture",
        "large_context",
        "code_generation",
        "image_reasoning",
        "efficiency"
      ],
      prompt_types: ["general", "scientific", "multimodal", "visual", "analytical", "coding"]
    },
    {
      id: "google/gemini-2.5-pro-exp-03-25:free",
      name: "Gemini 2.5 Pro",
      provider: "Google",
      specialty: "general",
      capabilities: [
        "advanced_reasoning",
        "multi_task",
        "multilingual_support",
        "large_scale"
      ],
      prompt_types: ["general", "scientific", "historical", "philosophical", "ethical", "cultural", "political", "economic", "analytical"]
    },
    {
      id: "qwen/qwen2.5-vl-32b-instruct:free",
      name: "Qwen 2.5 VL 32B",
      provider: "Qwen",
      specialty: "multimodal",
      capabilities: [
        "vision_understanding",
        "instruction_optimized",
        "multilingual_support",
        "chinese_language_proficiency"
      ],
      prompt_types: ["general", "scientific", "visual", "analytical", "cultural"]
    },
    {
      id: "deepseek/deepseek-chat-v3-0324:free",
      name: "DeepSeek Chat v3",
      provider: "DeepSeek",
      specialty: "general",
      capabilities: [
        "advanced_reasoning",
        "multi_task",
        "instruction_optimized"
      ],
      prompt_types: ["general", "scientific", "historical", "philosophical", "analytical", "coding"]
    },
    {
      id: "featherless/qwerky-72b:free",
      name: "Qwerky 72B",
      provider: "Featherless",
      specialty: "creative",
      capabilities: [
        "creative_writing",
        "storytelling",
        "roleplaying",
        "large_scale"
      ],
      prompt_types: ["creative", "cultural", "philosophical", "ethical"]
    },
    {
      id: "mistralai/mistral-small-3.1-24b-instruct:free",
      name: "Mistral Small 3.1",
      provider: "Mistral AI",
      specialty: "general",
      capabilities: [
        "instruction_optimized",
        "efficient_processing",
        "multilingual_support"
      ],
      prompt_types: ["general", "scientific", "historical", "philosophical", "ethical", "cultural", "analytical"]
    },
    {
      id: "open-r1/olympiccoder-32b:free",
      name: "Olympic Coder 32B",
      provider: "Open-R1",
      specialty: "coding",
      capabilities: [
        "code_generation",
        "technical_documentation",
        "debugging",
        "software_architecture"
      ],
      prompt_types: ["technical", "analytical", "coding", "scientific"]
    },
    {
      id: "google/gemma-3-12b-it:free",
      name: "Gemma 3 12B",
      provider: "Google",
      specialty: "general",
      capabilities: [
        "instruction_optimized",
        "efficient_processing",
        "multilingual_support"
      ],
      prompt_types: ["general", "scientific", "historical", "philosophical", "cultural", "analytical"]
    },
    {
      id: "deepseek/deepseek-r1-zero:free",
      name: "DeepSeek R1 Zero",
      provider: "DeepSeek",
      specialty: "general",
      capabilities: [
        "advanced_reasoning",
        "multi_task",
        "zero_shot_learning"
      ],
      prompt_types: ["general", "scientific", "historical", "philosophical", "analytical", "coding"]
    },
    {
      id: "qwen/qwq-32b:free",
      name: "QWQ 32B",
      provider: "Qwen",
      specialty: "general",
      capabilities: [
        "instruction_optimized",
        "chinese_language_proficiency",
        "multilingual_support"
      ],
      prompt_types: ["general", "scientific", "historical", "philosophical", "cultural", "analytical"]
    },
    {
      id: "moonshotai/moonlight-16b-a3b-instruct:free",
      name: "Moonlight 16B",
      provider: "Moonshot AI",
      specialty: "general",
      capabilities: [
        "instruction_optimized",
        "multi_task",
        "efficiency"
      ],
      prompt_types: ["general", "scientific", "historical", "philosophical", "analytical"]
    },
    {
      id: "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
      name: "Dolphin 3.0 R1 Mistral",
      provider: "Cognitive Computations",
      specialty: "general",
      capabilities: [
        "advanced_reasoning",
        "multi_task",
        "instruction_optimized"
      ],
      prompt_types: ["general", "scientific", "historical", "philosophical", "analytical", "coding"]
    },
    {
      id: "cognitivecomputations/dolphin3.0-mistral-24b:free",
      name: "Dolphin 3.0 Mistral",
      provider: "Cognitive Computations",
      specialty: "general",
      capabilities: [
        "advanced_reasoning",
        "multi_task",
        "instruction_optimized"
      ],
      prompt_types: ["general", "scientific", "historical", "philosophical", "analytical", "coding"]
    },
    {
      id: "qwen/qwen2.5-vl-72b-instruct:free",
      name: "Qwen 2.5 VL 72B",
      provider: "Qwen",
      specialty: "multimodal",
      capabilities: [
        "vision_understanding",
        "instruction_optimized",
        "large_scale",
        "chinese_language_proficiency"
      ],
      prompt_types: ["general", "scientific", "visual", "analytical", "cultural"]
    },
    {
      id: "deepseek/deepseek-r1-distill-qwen-32b:free",
      name: "DeepSeek R1 Distill Qwen 32B",
      provider: "DeepSeek",
      specialty: "general",
      capabilities: [
        "advanced_reasoning",
        "efficient_processing",
        "knowledge_distillation"
      ],
      prompt_types: ["general", "scientific", "historical", "philosophical", "analytical", "coding"]
    },
    {
      id: "deepseek/deepseek-r1-distill-qwen-14b:free",
      name: "DeepSeek R1 Distill Qwen 14B",
      provider: "DeepSeek",
      specialty: "general",
      capabilities: [
        "advanced_reasoning",
        "efficient_processing",
        "knowledge_distillation"
      ],
      prompt_types: ["general", "scientific", "historical", "philosophical", "analytical", "coding"]
    },
    {
      id: "deepseek/deepseek-r1-distill-llama-70b:free",
      name: "DeepSeek R1 Distill Llama 70B",
      provider: "DeepSeek",
      specialty: "general",
      capabilities: [
        "advanced_reasoning",
        "large_scale",
        "knowledge_distillation"
      ],
      prompt_types: ["general", "scientific", "historical", "philosophical", "analytical", "coding"]
    },
    {
      id: "google/gemini-2.0-flash-thinking-exp:free",
      name: "Gemini 2.0 Flash Thinking",
      provider: "Google",
      specialty: "general",
      capabilities: [
        "advanced_reasoning",
        "multi_task",
        "multilingual_support"
      ],
      prompt_types: ["general", "scientific", "historical", "philosophical", "ethical", "cultural", "political", "economic", "analytical"]
    },
    {
      id: "deepseek/deepseek-r1:free",
      name: "DeepSeek R1",
      provider: "DeepSeek",
      specialty: "general",
      capabilities: [
        "advanced_reasoning",
        "multi_task",
        "multilingual_support"
      ],
      prompt_types: ["general", "scientific", "historical", "philosophical", "ethical", "cultural", "political", "economic", "analytical"]
    },
    {
      id: "deepseek/deepseek-chat:free",
      name: "DeepSeek Chat",
      provider: "DeepSeek",
      specialty: "general",
      capabilities: [
        "instruction_optimized",
        "multi_task",
        "conversational"
      ],
      prompt_types: ["general", "scientific", "historical", "philosophical", "analytical", "coding"]
    },
    {
      id: "google/gemini-2.0-flash-thinking-exp-1219:free",
      name: "Gemini 2.0 Flash Thinking 1219",
      provider: "Google",
      specialty: "general",
      capabilities: [
        "advanced_reasoning",
        "multi_task",
        "multilingual_support"
      ],
      prompt_types: ["general", "scientific", "historical", "philosophical", "ethical", "cultural", "political", "economic", "analytical"]
    },
    {
      id: "meta-llama/llama-3.3-70b-instruct:free",
      name: "Llama 3.3 70B",
      provider: "Meta",
      specialty: "general",
      capabilities: [
        "advanced_reasoning",
        "instruction_optimized",
        "large_scale",
        "multilingual_support"
      ],
      prompt_types: ["general", "scientific", "historical", "philosophical", "ethical", "cultural", "political", "economic", "analytical"]
    },
    {
      id: "qwen/qwq-32b-preview:free",
      name: "QWQ 32B Preview",
      provider: "Qwen",
      specialty: "general",
      capabilities: [
        "instruction_optimized",
        "chinese_language_proficiency",
        "multilingual_support"
      ],
      prompt_types: ["general", "scientific", "historical", "philosophical", "cultural", "analytical"]
    }
  ],
  temperature: 0.7
};

// Hacer que la configuración esté disponible globalmente
if (typeof window !== 'undefined') {
  window.OPENROUTER_MODELS_CONFIG = OPENROUTER_MODELS_CONFIG;
}

// Exportar la configuración para uso como módulo ES6
try {
  if (typeof module !== 'undefined') {
    module.exports = OPENROUTER_MODELS_CONFIG;
  }
} catch (e) {
  // Ignorar errores en entornos que no soportan module.exports
  console.log('Modo no-módulo');
}
