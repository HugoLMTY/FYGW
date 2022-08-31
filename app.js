const prefixes 	= require('./tools/prefixes.json')
const middles 	= require('./tools/middles.json')
const suffixes 	= require('./tools/suffixes.json')

const colors 	= require('colors')

/**
 * ? Hola ! 

 * TODO La lecture des commentaires peut être simplifiée en utilisant une extension vscode
 * TODO aaron-bond.better-comments (https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
 **
 ** L'objectif de ce projet est de m'améliorer sur plusieurs points tels que l'optimisation, la lisibilité, la modularité, etc.
 ** Ce n'est pas un projet d'envergure, mais j'ai aimé le faire et quelques améliorations et nouvelles fonctionnalités arriveront surement dans le futur.
 ** J'aimerais par exemple utiliser ce projet dans une API qui renverrait une ou des insultes en fonction de paramètres mais c'est encore en cours de réflexion.
 ** De plus, je suis ouvert à toute suggestion, donc n'hésitez pas à me contacter ici -> hugo.lm2707@gmail.com
 **
 **	Encore une fois, ces insultes ne vous sont pas destinées, elles sont destinées à ce petit caillou dans votre chaussure qui vos détruit la voute plantaire.
 ** 
 ** Je tiens à remercier les personnes qui ont contribué à ce projet en proposant des idées, des corrections, etc.
 ** Merci à vous !
 **
 ** (Le package colors est bien utilisé ;) )
 **
 *! Merci d'avoir lu ce commentaire, et bonne journée !
 *? 1.0.2
*/

function getInsult() {


	//? Bypass le random pour avoir une insulte spécifique (pour les tests)
	const $rig 		= 	{ rigInsult: false, 	pre: true, 		mid: true, 		suf: true, 		range: false 	}
	const rigged 	= 	[ $rig, 				2, 				6, 				4, 				27 				]
	//*   rigged	=	[ useBypass, 			prefix, 		middle, 		suffix, 		range 			]


	//? Get values
	const getValue 	= (field) 		=> { return field[getRand(0, field.length)]	 					}
	const getRand 	= (min, max) 	=> { return Math.floor((Math.random()) * max) + min 			}

	//? Get states
	const hasVowel 	= (string) 		=> { return /[aeiouâéèê]/i.test(string[0])						}
	const isFemale 	= (word) 		=> { return word.gender.toLowerCase() == 'female'	 			}
	
	//? Format strings
	const toUpper 	= (string)		=> { return string.charAt(0).toUpperCase() + string.slice(1)	}
	const format	= (string)		=> { return string.trim().toLowerCase() 						}

	//? Filter arrays
	const filter	= (array)		=> { return array.filter(item => item.name !== '').map(item => { return { ...item, name: format(item.name) } }) }

	const $prefixes = filter(prefixes)
	const $middles 	= filter(middles)
	const $suffixes = filter(suffixes)

	//? Ligne un peu longue pour déterminer si on utilise le rig ou non
	let pre = rigged[0].rigInsult && rigged[0].pre ? $prefixes[rigged[1]] 	: getValue($prefixes)
	let mid = rigged[0].rigInsult && rigged[0].mid ? $middles[rigged[2]] 	: getValue($middles)
	let suf = rigged[0].rigInsult && rigged[0].suf ? $suffixes[rigged[3]] 	: getValue($suffixes)

	//? Si il y a un article défini ou partitif, on l'accorde avec le middle
	const preEnds = pre.name.split(" ").pop()
	switch(preEnds) {

		case "de":
			if (hasVowel(mid.name)) 	pre.name = pre.name.replace(" de", " d'")
			break;

		case "d'":
			if (!hasVowel(mid.name)) 	pre.name = pre.name.replace(" d'", " de")
			break;

		case "le":
			if (isFemale(mid)) 			pre.name = pre.name.replace(" le", " la")
			if (hasVowel(mid.name)) 	pre.name = pre.name.replace(" le", " l'")
			break;

		case "la":
			if (!isFemale(mid)) 		pre.name = pre.name.replace(" la", " le")
			if (hasVowel(mid.name)) 	pre.name = pre.name.replace(" la", " l'")
			break;

		case "l'":
			if (isFemale(mid)) 			pre.name = pre.name.replace(" l'", " la")
			if (!isFemale(mid)) 		pre.name = pre.name.replace(" l'", " le")
			if (!hasVowel(mid.name)) 	pre.name = pre.name.replace(" l'", " le")
			//? ↑ Tiendrais sur un ligne ( avec un || ) mais ca serait moche et moins lisible
			break;
	}

	const range = rigged[0].range ? rigged[4] : getRand(0, 100)

	//* Range vizualization
	//? 1111111111111113333333333433333333333333333333333333333333332222222222222222222222222222222222222222
	
	const insultLength = range <= 15
		? 1
		: range > 60
			? 2
			: range !== 27
				? 3
				: 4

	//? Ajout d'un espace si pas de lettre à apostrophe
	const $pre = `${ pre.name }${ pre.name.endsWith('\'') ? '' : ' ' }`

	//? Assignation à la variable représentant la partie centrale, dixit le corps lui-même, la valeur de l'insulte, contenue dans un objet regroupant diverses informations sur celle-ci, au préalable formatée et accordée dans le switch un peu plus haut
	const $mid = mid.name

	//? Accord du masculin/féminin
	const $suf = `${ suf.name.replace('$', mid.gender == 'female' ? 'e' : '') }`

	var insult = ''

	switch (insultLength) {
		case 1:
			insult = $mid
			break

		case 2:
			//? Varie entre prefixe / middle et middle / suffixe, pour + d'originalité
			insult = getRand(0, 10) > 5
				? `${$pre}${$mid}`
				: `${$mid} ${$suf}`
			if (range == 66) insult = insult.zalgo
			break

		case 3:
			insult = `${$pre}${$mid} ${$suf}`
			break

		case 4:
			//* Un peu d'amour <3
			insult = `You are worthy and I respect you`.rainbow
			break
	}

	return `${toUpper(insult)}.`
}

function main() {
	const insultCount 	= 1

	const sortInsults 	= false
	const stackInsults 	= false
	
	const showInsults 	= true
	const log 			= (data) => { if (showInsults) console.log(data) }

	let insults = []
	for (let i = 0; i < insultCount; i++) {
		const insult = getInsult()

		stackInsults
			? insults.push(insult)
			: log(insult)
	}

	insults = sortInsults
		? insults
			.sort((a, b) => { return a.length - b.length })
			.reverse()
		: insults

	if (stackInsults) log(insults.join('\n'))
}
main()