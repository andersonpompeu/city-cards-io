import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Como encontrar prestadores de serviços na minha região?",
    answer: "Utilize a barra de busca na página inicial para procurar por categoria de serviço ou nome do prestador. Você também pode filtrar por categorias específicas como eletricista, encanador, restaurantes e muito mais."
  },
  {
    question: "Os prestadores de serviços são verificados?",
    answer: "Sim, todos os prestadores cadastrados passam por um processo de verificação básica. Recomendamos sempre verificar as avaliações e informações de contato antes de contratar qualquer serviço."
  },
  {
    question: "Como entro em contato com um prestador de serviço?",
    answer: "Cada perfil de prestador contém informações de contato como telefone, e-mail e endereço. Você pode entrar em contato diretamente através desses canais. Alguns prestadores também disponibilizam links para WhatsApp."
  },
  {
    question: "Quanto custam os serviços listados?",
    answer: "Os valores variam de acordo com o tipo de serviço e prestador. Cada perfil indica uma faixa de preço aproximada. Recomendamos solicitar orçamentos diretamente com os prestadores para valores exatos."
  },
  {
    question: "Como cadastrar minha empresa no diretório?",
    answer: "Acesse a página 'Cadastrar Empresa' através do menu principal. Preencha todas as informações solicitadas incluindo nome, categoria, descrição, contato e localização. Após o envio, sua empresa será analisada e aprovada."
  },
  {
    question: "Posso avaliar os serviços que contratei?",
    answer: "Sim, as avaliações são fundamentais para manter a qualidade do diretório. Entre em contato conosco para submeter sua avaliação sobre serviços que você contratou através da plataforma."
  },
  {
    question: "Qual a área de cobertura dos serviços?",
    answer: "A maioria dos prestadores atende Maringá e região metropolitana, incluindo Sarandi e Paiçandu. Cada perfil especifica as áreas de atendimento. Alguns prestadores podem atender áreas mais amplas mediante consulta."
  },
  {
    question: "Como funciona o horário de atendimento?",
    answer: "Cada prestador define seu próprio horário de funcionamento, que está indicado no perfil. Alguns oferecem atendimento emergencial 24 horas. Sempre confirme a disponibilidade ao entrar em contato."
  },
  {
    question: "É gratuito usar o diretório?",
    answer: "Sim, a consulta e busca de prestadores de serviços é totalmente gratuita. Você paga apenas pelos serviços que contratar diretamente com os prestadores."
  },
  {
    question: "Como reportar um problema com um prestador?",
    answer: "Se você teve alguma experiência negativa ou identificou informações incorretas, entre em contato conosco através do e-mail de suporte. Analisaremos sua reclamação e tomaremos as medidas apropriadas."
  }
];

const FAQ = () => {
  // Generate FAQPage Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Perguntas Frequentes - Diretório de Empresas Maringá</title>
        <meta 
          name="description" 
          content="Tire suas dúvidas sobre como encontrar e contratar prestadores de serviços locais em Maringá. Respostas para as perguntas mais frequentes." 
        />
        <link rel="canonical" href="https://seusite.com/faq" />
        
        {/* FAQPage Schema */}
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o Início
              </Button>
            </Link>
            
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Perguntas Frequentes
            </h1>
            <p className="text-muted-foreground text-lg">
              Encontre respostas para as dúvidas mais comuns sobre nosso diretório de empresas e prestadores de serviços em Maringá.
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* CTA Section */}
          <div className="mt-12 p-8 bg-primary/5 border border-primary/20 rounded-lg text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Não encontrou o que procurava?
            </h2>
            <p className="text-muted-foreground mb-6">
              Entre em contato conosco ou cadastre sua empresa para fazer parte do nosso diretório.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cadastrar">
                <Button size="lg">
                  Cadastrar Empresa
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="lg">
                  Buscar Serviços
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
