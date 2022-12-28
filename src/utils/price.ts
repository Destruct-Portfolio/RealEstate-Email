export default class Price {

    // IMPORTANT/ values should be without dollar signs and plus signs
    public static format (value: string){

        const _ = value.toUpperCase()
        // case where there is a 'K' in the price
        if(_.includes("K")){
            return _
                .replace("K", "000")
        }

        // case where it is a range -> there is a '-'
        if(_.includes("-")){
            const [lower, upper] = _.split("-")

            return eval(`(${lower}+${upper})/2`)
        }
    }
}