import { Instagram, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-background to-muted/20 border-t border-border/50 mt-16">
      <div className="w-[90%] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Contato
            </h3>
            <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
              <Phone className="h-5 w-5" />
              <a
                href="https://wa.me/5585985114497?text=Olá!%20Vim%20através%20do%20portfólio%20de%20estoque%20e%20gostaria%20de%20informações%20sobre%20um%20veículo."
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                (85) 98511-4497
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Redes Sociais
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <a
                  href="https://instagram.com/parisdakarrepasse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  @parisdakarrepasse
                </a>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <a
                  href="https://instagram.com/carronamidia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  @carronamidia
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Localização
            </h3>
            <div className="flex items-start gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm leading-relaxed">
                  Av. Rogaciano Leite, 1990<br />
                  Salinas - Fortaleza, Ceará
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Sobre Nós
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Especialistas em veículos de qualidade com os melhores preços do mercado.
              Encontre seu carro ideal conosco.
            </p>
          </div>
        </div>

        <div className="border-t border-border/30 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Carro na Mídia. Todos os direitos reservados.
            </p>
            <p className="text-muted-foreground text-sm">
              Desenvolvido por{" "}
              <a
                href="https://nex-code.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors font-medium hover:underline"
              >
                SwiftlyDev
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;