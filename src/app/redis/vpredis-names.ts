export class VPRedisNames {
    public static getEquipamentoVariaveis(fkEquipamento : string) : string{
        return 'EQUIPAMENTO_VARIAVEL_' + fkEquipamento.toUpperCase();
    }

    public static getFilaEventos() : string{
        return 'EVENTOS';
    }
}